import fs from 'fs';
import https from 'https';
import os from 'os';
import path from 'path';
import { copyDirectory, ensureDirectory, safeChildPath, validateEntryName } from './safePath';

interface SkillLoaderOptions {
  githubOwner?: string;
  githubRepo?: string;
  tempDir?: string;
}

interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  url?: string;
}

interface GitHubTag {
  name: string;
  commit: {
    sha: string;
    url: string;
    commit?: {
      author?: {
        date: string;
      };
    };
  };
}

interface Skill {
  name: string;
  path: string;
  description: string;
  version: string;
}

interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
}

class SkillLoader {
  private githubOwner: string;
  private githubRepo: string;
  private tempDir: string;

  constructor(options: SkillLoaderOptions = {}) {
    this.githubOwner = options.githubOwner || 'ant-design';
    this.githubRepo = options.githubRepo || 'x';
    this.tempDir = options.tempDir || fs.mkdtempSync(path.join(os.tmpdir(), 'x-skill-temp-'));
  }

  async makeRequest(
    url: string,
    options: { headers?: Record<string, string>; signal?: AbortSignal } = {},
  ): Promise<any> {
    const headers: Record<string, string> = {
      'User-Agent': 'X-Skill-Loader',
      Accept: 'application/vnd.github.v3+json',
      ...options.headers,
    };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    const data = await this.requestText(url, 'api', headers, options.signal);
    try {
      return JSON.parse(data);
    } catch {
      throw new Error('Failed to parse JSON response');
    }
  }

  async downloadFile(url: string, signal?: AbortSignal): Promise<string> {
    return this.requestText(url, 'download', {}, signal);
  }

  private async requestText(
    url: string,
    kind: 'api' | 'download',
    headers: Record<string, string>,
    signal?: AbortSignal,
    redirects = 0,
  ): Promise<string> {
    const parsed = new URL(url);
    const hosts =
      kind === 'api' ? ['api.github.com'] : ['api.github.com', 'raw.githubusercontent.com'];
    if (
      parsed.protocol !== 'https:' ||
      !hosts.includes(parsed.hostname) ||
      parsed.username ||
      parsed.password ||
      (parsed.port && parsed.port !== '443')
    ) {
      throw new Error(`Untrusted GitHub URL: ${url}`);
    }
    signal?.throwIfAborted();
    return new Promise((resolve, reject) => {
      const request = https
        .get(parsed.href, { headers, signal }, (res) => {
          res.on('error', reject);
          if ([301, 302, 303, 307, 308].includes(res.statusCode!)) {
            res.resume();
            if (!res.headers.location || redirects >= 5) {
              reject(new Error('Invalid or excessive GitHub redirects'));
              return;
            }
            // Never carry credentials into a redirected request, even on the same host.
            const redirectHeaders = Object.fromEntries(
              Object.entries(headers).filter(
                ([key]) =>
                  !['authorization', 'proxy-authorization', 'cookie'].includes(key.toLowerCase()),
              ),
            );
            try {
              resolve(
                this.requestText(
                  new URL(res.headers.location, parsed).href,
                  kind,
                  redirectHeaders,
                  signal,
                  redirects + 1,
                ),
              );
            } catch (error) {
              reject(error);
            }
            return;
          }
          if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
            res.resume();
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
            return;
          }
          let data = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(data));
        })
        .on('error', reject);
      request.setTimeout(30000, () => {
        request.destroy(new Error('Request timeout after 30 seconds'));
      });
    });
  }

  async downloadDirectory(url: string, destPath: string, signal?: AbortSignal): Promise<void> {
    let apiUrl: string;

    const urlObj = new URL(url);

    if (urlObj.hostname === 'raw.githubusercontent.com') {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length < 4) throw new Error('Invalid raw GitHub URL format');
      const [owner, repo, ref, ...pathPartsRest] = pathParts;
      const filePath = pathPartsRest.join('/');
      apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      if (ref !== 'main' && ref !== 'master') {
        apiUrl += `?ref=${ref}`;
      }
    } else if (urlObj.hostname === 'api.github.com') {
      apiUrl = url;
    } else {
      throw new Error('Unsupported URL format');
    }

    ensureDirectory(destPath);
    const contents = (await this.makeRequest(apiUrl, { signal })) as GitHubContent[];
    signal?.throwIfAborted();

    for (const item of contents) {
      const itemPath = safeChildPath(destPath, item.name);

      if (item.type === 'file') {
        const fileContent = await this.downloadFile(item.download_url!, signal);
        signal?.throwIfAborted();
        fs.writeFileSync(itemPath, fileContent, { flag: 'wx' });
      } else if (item.type === 'dir') {
        ensureDirectory(itemPath);
        await this.downloadDirectory(item.url!, itemPath, signal);
      } else {
        throw new Error(`Unsupported GitHub entry type: ${item.type}`);
      }
    }
  }

  async downloadSkillFromGitHub(
    skillName: string,
    version = 'latest',
    language = 'en',
  ): Promise<string> {
    validateEntryName(skillName);
    ensureDirectory(this.tempDir);
    const skillTempDir = safeChildPath(this.tempDir, skillName);

    // 安装前清理同名技能文件夹
    if (fs.existsSync(skillTempDir)) {
      fs.rmSync(skillTempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(skillTempDir, { recursive: true });

    try {
      // 1. 先从GitHub下载，设置60秒超时
      const tag = version === 'latest' ? await this.getLatestTag() : version;
      const basePath = language === 'zh' ? 'packages/x-skill/skills-zh' : 'packages/x-skill/skills';
      const apiUrl = `https://api.github.com/repos/${this.githubOwner}/${this.githubRepo}/contents/${basePath}/${skillName}?ref=${encodeURIComponent(tag)}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(new Error('Download timeout: 60s')),
        60000,
      );
      try {
        await this.downloadDirectory(apiUrl, skillTempDir, controller.signal);
      } finally {
        clearTimeout(timeoutId);
      }
      return skillTempDir;
    } catch (error) {
      console.warn(
        `Failed to download skill ${skillName} from GitHub: ${(error as Error).message}`,
      );

      // 2. 下载失败，提示失败并安装本地技能
      console.log(`Installing local skill: ${skillName}`);

      const packageDir = path.join(__dirname, '..');
      const skillsDir = safeChildPath(
        path.join(packageDir, language === 'zh' ? 'skills-zh' : 'skills'),
        skillName,
      );

      if (!fs.existsSync(skillsDir)) {
        throw new Error(`Local skill directory not found: ${skillsDir}`);
      }

      this.copyDirectorySync(skillsDir, skillTempDir);
      return skillTempDir;
    }
  }

  private compareVersions(a: GitHubTag, b: GitHubTag): number {
    const parseVersion = (version: string): ParsedVersion => {
      const cleanVersion = version.replace(/^v/, '');
      const parts = cleanVersion.split('-')[0].split('.');
      return {
        major: parseInt(parts[0] || '0', 10),
        minor: parseInt(parts[1] || '0', 10),
        patch: parseInt(parts[2] || '0', 10),
        prerelease: cleanVersion.includes('-') ? cleanVersion.split('-')[1] : null,
      };
    };

    const vA = parseVersion(a.name);
    const vB = parseVersion(b.name);

    if (vA.major !== vB.major) return vB.major - vA.major;
    if (vA.minor !== vB.minor) return vB.minor - vA.minor;
    if (vA.patch !== vB.patch) return vB.patch - vA.patch;

    if (!vA.prerelease && vB.prerelease) return -1;
    if (vA.prerelease && !vB.prerelease) return 1;
    if (vA.prerelease && vB.prerelease) {
      // 使用降序排序，确保最新的预发布版本排在前面
      return vB.prerelease.localeCompare(vA.prerelease);
    }

    return 0;
  }

  async getLatestTag(): Promise<string> {
    try {
      const tags = (await this.makeRequest(
        `https://api.github.com/repos/${this.githubOwner}/${this.githubRepo}/tags`,
      )) as GitHubTag[];

      const validVersions = tags.filter((tag) =>
        /^v?\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/.test(tag.name),
      );

      if (validVersions.length > 0) {
        validVersions.sort(this.compareVersions);
        return validVersions[0].name;
      }

      if (tags.length > 0) {
        tags.sort(
          (a, b) =>
            new Date(b.commit?.commit?.author?.date || 0).getTime() -
            new Date(a.commit?.commit?.author?.date || 0).getTime(),
        );
        return tags[0].name;
      }
      return 'main';
    } catch (error) {
      console.error('Failed to fetch tags:', (error as Error).message);
      return 'main';
    }
  }

  private extractDescription(skillPath: string, skillName: string): string {
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    if (!fs.existsSync(skillMdPath)) return skillName;

    try {
      const content = fs.readFileSync(skillMdPath, 'utf-8');
      const descMatch = content.match(/^description:\s*(.*)$/m) || content.match(/^#\s*(.*)$/m);
      const description = descMatch ? descMatch[1].trim() : '';

      if (
        !description ||
        description === '-' ||
        description === '---' ||
        description === skillName
      ) {
        return skillName;
      }
      return description;
    } catch {
      return skillName;
    }
  }

  async loadSkills(version = 'latest', language = 'en'): Promise<Skill[]> {
    try {
      const tag = version === 'latest' ? await this.getLatestTag() : version;
      const basePath = language === 'zh' ? 'packages/x-skill/skills-zh' : 'packages/x-skill/skills';

      // 使用Promise.race实现列表获取超时控制
      const apiUrl = `https://api.github.com/repos/${this.githubOwner}/${this.githubRepo}/contents/${basePath}?ref=${encodeURIComponent(tag)}`;
      const listPromise = this.makeRequest(apiUrl) as Promise<GitHubContent[]>;
      let timeoutId: NodeJS.Timeout;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('List skills timeout: 60s')), 60000);
      });

      let contents: GitHubContent[];
      try {
        contents = await Promise.race([listPromise, timeoutPromise]);
      } finally {
        clearTimeout(timeoutId!);
      }
      const skillDirs = contents.filter((item) => item.type === 'dir').map((item) => item.name);

      const skills: Skill[] = [];

      for (const skillName of skillDirs) {
        try {
          const skillTempDir = await this.downloadSkillFromGitHub(skillName, version, language);
          skills.push({
            name: skillName,
            path: skillTempDir,
            description: this.extractDescription(skillTempDir, skillName),
            version: tag,
          });
        } catch (error) {
          console.warn(`Skipping skill ${skillName}: ${(error as Error).message}`);
        }
      }

      if (skills.length === 0) {
        throw new Error('No available skills found');
      }

      return skills;
    } catch (error) {
      console.warn(`Failed to load skills from remote: ${(error as Error).message}`);
      return await this.loadLocalSkills(language);
    }
  }

  async loadLocalSkills(language = 'zh'): Promise<Skill[]> {
    const packageDir = path.join(__dirname, '..');
    const skillsDir =
      language === 'zh' ? path.join(packageDir, 'skills-zh') : path.join(packageDir, 'skills');

    const skillDirs = fs
      .readdirSync(skillsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    return skillDirs.map((skillName) => {
      const skillPath = safeChildPath(skillsDir, skillName);
      return {
        name: skillName,
        path: skillPath,
        description: this.extractDescription(skillPath, skillName),
        version: 'local',
      };
    });
  }

  private copyDirectorySync(src: string, dest: string): void {
    safeChildPath(path.dirname(dest), path.basename(dest));
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
    }
    copyDirectory(src, dest);
  }

  async listVersions(): Promise<string[]> {
    try {
      const tags = (await this.makeRequest(
        `https://api.github.com/repos/${this.githubOwner}/${this.githubRepo}/tags`,
      )) as GitHubTag[];

      if (tags.length === 0) {
        throw new Error('No version tags found');
      }

      const validVersions = tags.filter((tag) =>
        /^v?\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/.test(tag.name),
      );

      if (validVersions.length > 0) {
        validVersions.sort(this.compareVersions);
        return validVersions.map((tag) => tag.name);
      }

      return tags.map((tag) => tag.name);
    } catch (error) {
      throw new Error(`Failed to fetch tags: ${(error as Error).message}`);
    }
  }
}

export default SkillLoader;
