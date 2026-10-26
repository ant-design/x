import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import fs from 'node:fs';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { TestContext, test } from 'node:test';
import SkillLoader from '../src/getSkillRepo';
import { SkillInstaller } from '../src/index';
import { copyDirectory, safeChildPath, validateEntryName } from '../src/safePath';

const apiUrl = 'https://api.github.com/repos/ant-design/x/contents/skills';
const rawUrl = 'https://raw.githubusercontent.com/ant-design/x/main/SKILL.md';
const unsafeNames = [
  '',
  '.',
  '..',
  '../victim',
  '..\\..\\.claude',
  '/tmp/victim',
  'C:\\victim',
  'C:evil',
  'dir/file',
  'dir\\file',
  'file\0.md',
  'file:stream',
  'skill.',
  'CON',
  'NUL.md',
  '%2e%2e',
];

function fixture(t: TestContext): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'x-skill-security-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function setTestToken(t: TestContext): void {
  const original = process.env.GITHUB_TOKEN;
  process.env.GITHUB_TOKEN = 'test-token';
  t.after(() => {
    if (original === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = original;
  });
}

test('rejects unsafe names on both POSIX and Windows before deleting or downloading', async (t) => {
  const root = fixture(t);
  const victim = path.join(root, 'victim');
  fs.mkdirSync(victim);
  fs.writeFileSync(path.join(victim, 'settings.json'), 'original');
  const loader = new SkillLoader({ tempDir: path.join(root, 'temp') });
  t.mock.method(loader, 'makeRequest', () => assert.fail('must not request an unsafe skill'));

  for (const name of unsafeNames) {
    assert.throws(() => validateEntryName(name), /Unsafe/);
    await assert.rejects(loader.downloadSkillFromGitHub(name, 'v1.0.0'), /Unsafe/);
  }
  assert.equal(fs.readFileSync(path.join(victim, 'settings.json'), 'utf8'), 'original');
  assert.equal(fs.existsSync(path.join(root, 'temp')), false);
});

test('rejects malicious names in remote directory listings without writing outside the destination', async (t) => {
  const root = fixture(t);
  const loader = new SkillLoader({ tempDir: root });
  t.mock.method(loader, 'downloadFile', () =>
    assert.fail('must validate names before downloading'),
  );
  for (const name of unsafeNames) {
    const request = t.mock.method(loader, 'makeRequest', async () => [
      { name, type: 'file', download_url: rawUrl },
    ]);
    await assert.rejects(loader.downloadDirectory(apiUrl, root), /Unsafe/);
    request.mock.restore();
  }
  assert.deepEqual(fs.readdirSync(root), []);
});

test('downloads and installs a valid nested skill and replaces only the selected skill', async (t) => {
  const root = fixture(t);
  const loader = new SkillLoader({ tempDir: path.join(root, 'temp') });
  const requests: string[] = [];
  t.mock.method(loader, 'makeRequest', async (url: string) => {
    requests.push(url);
    return url === apiUrl
      ? [{ name: 'API.md', type: 'file', download_url: rawUrl }]
      : [
          { name: 'SKILL.md', type: 'file', download_url: rawUrl },
          { name: 'reference', type: 'dir', url: apiUrl },
        ];
  });
  t.mock.method(loader, 'downloadFile', async () => 'trusted content');
  const source = await loader.downloadSkillFromGitHub('use-x-chat', 'release/test?ref=evil');
  assert.match(requests[0], /ref=release%2Ftest%3Fref%3Devil$/);

  const installer = Object.create(SkillInstaller.prototype);
  // Keep installation in the fake home; no real assistant configuration is touched.
  t.mock.method(os, 'homedir', () => root);
  installer.skillConfig = { targets: { claude: { paths: { global: '.claude/skills' } } } };
  installer.skills = [{ name: 'use-x-chat', path: source }];
  fs.mkdirSync(path.join(root, '.claude/skills/use-x-chat'), { recursive: true });
  fs.writeFileSync(path.join(root, '.claude/settings.json'), 'original config');
  fs.writeFileSync(path.join(root, '.claude/skills/use-x-chat/old.md'), 'old skill');
  await installer.installSkills(['use-x-chat'], 'claude', true);
  assert.equal(
    fs.readFileSync(path.join(root, '.claude/settings.json'), 'utf8'),
    'original config',
  );
  assert.equal(fs.existsSync(path.join(root, '.claude/skills/use-x-chat/old.md')), false);
  assert.equal(
    fs.readFileSync(path.join(root, '.claude/skills/use-x-chat/reference/API.md'), 'utf8'),
    'trusted content',
  );

  for (const name of unsafeNames) {
    installer.skills = [{ name, path: source }];
    await assert.rejects(installer.installSkills([name], 'claude', true), /Unsafe/);
  }
  assert.equal(
    fs.readFileSync(path.join(root, '.claude/settings.json'), 'utf8'),
    'original config',
  );
});

test('remote list cannot expose a traversal skill for installation', async (t) => {
  const root = fixture(t);
  const loader = new SkillLoader({ tempDir: root });
  t.mock.method(loader, 'makeRequest', async () => [{ name: '..\\..\\.claude', type: 'dir' }]);
  const skills = await loader.loadSkills('v1.0.0');
  assert.ok(skills.length > 0);
  assert.ok(skills.every((skill) => !skill.name.includes('\\')));
  assert.deepEqual(fs.readdirSync(root), []);
});

test('rejects copying a directory into itself, including canonical path aliases', (t) => {
  const root = fixture(t);
  const source = path.join(root, 'source');
  fs.mkdirSync(source);
  fs.writeFileSync(path.join(source, 'SKILL.md'), 'original');
  assert.throws(() => copyDirectory(source, source), /into itself/);
  assert.throws(() => copyDirectory(source, path.join(source, 'nested')), /into itself/);
  assert.equal(fs.readFileSync(path.join(source, 'SKILL.md'), 'utf8'), 'original');
});

test('remote refs cannot escape the cache directory', (t) => {
  const root = fixture(t);
  const installer = Object.create(SkillInstaller.prototype);
  installer.cacheDir = root;
  const key = 'skills_../../victim';
  installer.setCache(key, ['use-x-chat']);
  assert.deepEqual(installer.getCache(key), ['use-x-chat']);
  assert.equal(fs.readdirSync(root).length, 1);
  installer.clearCache(key);
  assert.deepEqual(fs.readdirSync(root), []);
});

test('long remote tags retain the requested skills without falling back on cache writes', async (t) => {
  const root = fixture(t);
  const installer = Object.create(SkillInstaller.prototype);
  const tag = `v1.0.0-${'a'.repeat(180)}`;
  const skills = [{ name: 'use-x-chat', version: tag, path: root }];
  installer.cacheDir = root;
  installer.args = { tag };
  installer.language = 'en';
  installer.helpManager = { colorize: (value: string) => value };
  installer.skillLoader = { loadSkills: async () => skills };
  t.mock.method(installer, 'loadLocalSkills', () => assert.fail('must preserve remote skills'));
  await installer.loadSkills();
  assert.deepEqual(installer.skills, skills);
  assert.deepEqual(installer.getCache(`skills_${tag}`), skills);
  assert.match(fs.readdirSync(root)[0], /^[a-f0-9]{64}\.json$/);
  installer.clearCache(`skills_${tag}`);
  assert.deepEqual(fs.readdirSync(root), []);
});

test('rejects symlink sources, destinations, and installation ancestors', async (t) => {
  const root = fixture(t);
  const source = path.join(root, 'source');
  const victim = path.join(root, 'victim');
  fs.mkdirSync(source);
  fs.mkdirSync(victim);
  fs.writeFileSync(path.join(victim, 'settings.json'), 'original');
  fs.symlinkSync(victim, path.join(root, 'linked'), 'dir');
  assert.throws(() => safeChildPath(root, 'linked'), /Symbolic link/);
  assert.throws(() => copyDirectory(source, path.join(root, 'linked')), /Not a directory/);
  fs.symlinkSync(path.join(victim, 'settings.json'), path.join(source, 'SKILL.md'));
  assert.throws(() => copyDirectory(source, path.join(root, 'copy')), /Symbolic link/);

  const loader = new SkillLoader({ tempDir: path.join(root, 'linked') });
  await assert.rejects(loader.downloadSkillFromGitHub('use-x-chat', 'v1.0.0'), /Not a directory/);
  const installer = Object.create(SkillInstaller.prototype);
  t.mock.method(os, 'homedir', () => root);
  installer.skillConfig = { targets: { claude: { paths: { global: 'linked/skills' } } } };
  await assert.rejects(installer.installSkills(['use-x-chat'], 'claude', true), /Symbolic link/);
  assert.equal(fs.readFileSync(path.join(victim, 'settings.json'), 'utf8'), 'original');
  assert.equal(fs.existsSync(path.join(victim, 'skills')), false);
});

test('cleans partial remote files before falling back to the packaged skill', async (t) => {
  const root = fixture(t);
  const loader = new SkillLoader({ tempDir: root });
  t.mock.method(loader, 'downloadDirectory', async (_url: string, dest: string) => {
    fs.writeFileSync(path.join(dest, 'unexpected.md'), 'partial remote content');
    throw new Error('network failed');
  });
  const skill = await loader.downloadSkillFromGitHub('use-x-chat', 'v1.0.0');
  assert.ok(fs.existsSync(path.join(skill, 'SKILL.md')));
  assert.equal(fs.existsSync(path.join(skill, 'unexpected.md')), false);
});

test('an aborted download cannot write late data into a fallback directory', async (t) => {
  const root = fixture(t);
  const loader = new SkillLoader({ tempDir: root });
  const controller = new AbortController();
  t.mock.method(loader, 'makeRequest', async () => [
    { name: 'SKILL.md', type: 'file', download_url: rawUrl },
  ]);
  t.mock.method(loader, 'downloadFile', async () => {
    controller.abort();
    return 'late data';
  });
  await assert.rejects(loader.downloadDirectory(apiUrl, root, controller.signal), {
    name: 'AbortError',
  });
  assert.deepEqual(fs.readdirSync(root), []);
});

interface Reply {
  status?: number;
  statusMessage?: string;
  location?: string;
  body?: string;
}

function mockNetwork(t: TestContext, replies: Reply[]) {
  const calls: { url: string; headers: Record<string, string> }[] = [];
  t.mock.method(
    https,
    'get',
    (
      url: string,
      options: { headers: Record<string, string> },
      callback: (res: PassThrough) => void,
    ) => {
      calls.push({ url, headers: options.headers });
      const reply = replies.shift();
      assert.ok(reply, 'unexpected network request');
      const request = new EventEmitter();
      Object.assign(request, {
        setTimeout() {},
        destroy(error: Error) {
          request.emit('error', error);
        },
      });
      queueMicrotask(() => {
        const response = Object.assign(new PassThrough(), {
          statusCode: reply.status ?? 200,
          statusMessage: reply.statusMessage,
          headers: { location: reply.location },
        });
        callback(response);
        response.end(reply.body ?? '{}');
      });
      return request;
    },
  );
  return calls;
}

test('API 403 responses retain rate limit guidance while other HTTP errors stay unchanged', async (t) => {
  const root = fixture(t);
  const loader = new SkillLoader({ tempDir: root });
  mockNetwork(t, [
    { status: 403, statusMessage: 'Forbidden' },
    { status: 404, statusMessage: 'Not Found' },
    { status: 403, statusMessage: 'Forbidden' },
  ]);
  await assert.rejects(loader.makeRequest(apiUrl), /rate limit.*GITHUB_TOKEN/);
  await assert.rejects(loader.makeRequest(apiUrl), { message: 'HTTP 404: Not Found' });
  await assert.rejects(loader.downloadFile(rawUrl), { message: 'HTTP 403: Forbidden' });
});

test('rejects untrusted hosts, protocols, credentials, and ports before making a request', async (t) => {
  const root = fixture(t);
  const loader = new SkillLoader({ tempDir: root });
  t.mock.method(https, 'get', () => assert.fail('untrusted URL must never be requested'));
  for (const url of [
    'https://attacker.example/skill',
    'http://raw.githubusercontent.com/skill',
    'https://api.github.com.attacker.example/skill',
    'https://api.github.com:8443/skill',
    'https://token@api.github.com/skill',
    'https://127.0.0.1/skill',
  ]) {
    await assert.rejects(loader.downloadFile(url), /Untrusted/);
    await assert.rejects(loader.makeRequest(url), /Untrusted/);
  }
});

test('strips credentials from allowed redirects and bounds redirect loops', async (t) => {
  const root = fixture(t);
  const loader = new SkillLoader({ tempDir: root });
  setTestToken(t);
  const calls = mockNetwork(t, [
    { status: 302, location: '/redirected' },
    { body: '{"ok":true}' },
    ...Array.from({ length: 6 }, () => ({ status: 301, location: '/loop' })),
  ]);
  assert.deepEqual(
    await loader.makeRequest(apiUrl, {
      headers: { Cookie: 'secret', authorization: 'another-secret' },
    }),
    { ok: true },
  );
  assert.equal(calls[0].headers.Authorization, 'token test-token');
  assert.ok(
    Object.keys(calls[1].headers).every(
      (key) => !['authorization', 'cookie'].includes(key.toLowerCase()),
    ),
  );
  await assert.rejects(loader.makeRequest(apiUrl), /excessive/);
});

test('rejects untrusted and malformed redirect targets without forwarding the token', async (t) => {
  const root = fixture(t);
  const loader = new SkillLoader({ tempDir: root });
  setTestToken(t);
  const calls = mockNetwork(t, [
    { status: 302, location: 'https://attacker.example/steal' },
    { status: 302, location: 'http://[' },
    { status: 302, location: 'https://attacker.example/skill' },
  ]);
  await assert.rejects(loader.makeRequest(apiUrl), /Untrusted/);
  await assert.rejects(loader.makeRequest(apiUrl), /Invalid URL/);
  await assert.rejects(loader.downloadFile(rawUrl), /Untrusted/);
  assert.equal(calls.length, 3);
  assert.deepEqual(calls[2].headers, {});
});

test('downloads from GitHub raw content and follows relative redirects without credentials', async (t) => {
  const root = fixture(t);
  const loader = new SkillLoader({ tempDir: root });
  setTestToken(t);
  const calls = mockNetwork(t, [
    { status: 302, location: '/ant-design/x/v1.0.0/SKILL.md' },
    { body: '# Skill' },
  ]);
  assert.equal(await loader.downloadFile(rawUrl), '# Skill');
  assert.equal(calls[1].url, 'https://raw.githubusercontent.com/ant-design/x/v1.0.0/SKILL.md');
  assert.ok(calls.every((call) => Object.keys(call.headers).length === 0));
});
