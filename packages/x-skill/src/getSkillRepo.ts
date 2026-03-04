import fs from 'fs';
import https from 'https';
import os from 'os';
import path from 'path';

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
    this.tempDir = options.tempDir || path.join(os.tmpdir(), 'x-skill-temp');
  }

  async makeRequest(url: string, options: { headers?: Record<string, string> } = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        headers: {
          'User-Agent': 'X-Skill-Loader',
          Accept: 'application/vnd.github.v3+json',
          ...options.headers,
        } as Record<string, string>,
        timeout: 60000, // 60秒超时
      };

      // 添加GitHub token支持
      const githubToken = process.env.GITHUB_TOKEN;
      if (githubToken) {
        requestOptions.headers = {
          ...requestOptions.headers,
          Authorization: `token ${githubToken}`,
        };
      }

      const req = https
        .get(url, requestOptions, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              try {
                resolve(JSON.parse(data));
              } catch (_e) {
                reject(new Error('Failed to parse JSON response'));
              }
            } else if (res.statusCode === 302 || res.statusCode === 301) {
              // Follow redirect
              const redirectOptions = { ...requestOptions };
              const redirectReq = https
                .get(res.headers.location!, redirectOptions, (res2) => {
                  let data2 = '';
                  res2.on('data', (chunk) => (data2 += chunk));
                  res2.on('end', () => {
                    if (res2.statusCode && res2.statusCode >= 200 && res2.statusCode < 300) {
                      try {
                        resolve(JSON.parse(data2));
                      } catch (_e) {
                        reject(new Error('Failed to parse JSON response'));
                      }
                    } else {
                      reject(new Error(`HTTP ${res2.statusCode}: ${res2.statusMessage}`));
                    }
                  });
                })
                .on('error', reject);

              // 设置重定向请求的超时
              redirectReq.setTimeout(60000, () => {
                redirectReq.destroy();
                reject(new Error('Request timeout after 60 seconds'));
              });
            } else {
              if (res.statusCode === 403) {
                reject(
                  new Error(
                    `GitHub API access denied: ${res.statusMessage}. Please use classic personal access token instead of fine-grained token`,
                  ),
                );
              } else {
                reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
              }
            }
          });
        })
        .on('error', reject);

      // 设置超时
      req.setTimeout(60000, () => {
        req.destroy();
        reject(new Error('Request timeout after 60 seconds'));
      });
    });
  }

  async downloadFile(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          if (res.statusCode === 302 || res.statusCode === 301) {
            // Follow redirect
            https
              .get(res.headers.location!, (res2) => {
                let data = '';
                res2.on('data', (chunk) => (data += chunk));
                res2.on('end', () => resolve(data));
              })
              .on('error', reject);
            return;
          }

          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(data));
        })
        .on('error', reject);
    });
  }

  async downloadDirectory(url: string, destPath: string): Promise<void> {
    let apiUrl: string;

    if (url.includes('raw.githubusercontent.com')) {
      const match = url.match(/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)/);
      if (!match) throw new Error('Invalid raw GitHub URL format');
      const [, owner, repo, ref, path] = match;
      apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      if (ref !== 'main' && ref !== 'master') {
        apiUrl += `?ref=${ref}`;
      }
    } else if (url.includes('api.github.com')) {
      apiUrl = url;
    } else {
      throw new Error('Unsupported URL format');
    }

    const contents = (await this.makeRequest(apiUrl)) as GitHubContent[];

    for (const item of contents) {
      if (item.type === 'file') {
        const fileContent = await this.downloadFile(item.download_url!);
        const filePath = path.join(destPath, item.name);
        fs.writeFileSync(filePath, fileContent);
      } else if (item.type === 'dir') {
        const subDirPath = path.join(destPath, item.name);
        fs.mkdirSync(subDirPath, { recursive: true });
        await this.downloadDirectory(item.url!, subDirPath);
      }
    }
  }

  async downloadSkillFromGitHub(
    skillName: string,
    version = 'latest',
    language = 'en',
  ): Promise<string> {
    fs.mkdirSync(this.tempDir, { recursive: true });
    const skillTempDir = path.join(this.tempDir, skillName);

    // 安装前清理同名技能文件夹
    if (fs.existsSync(skillTempDir)) {
      fs.rmSync(skillTempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(skillTempDir, { recursive: true });

    try {
      // 1. 先从GitHub下载，设置60秒超时
      const tag = version === 'latest' ? await this.getLatestTag() : version;
      const basePath = language === 'zh' ? 'packages/x-skill/skills-zh' : 'packages/x-skill/skills';
      const apiUrl = `https://api.github.com/repos/${this.githubOwner}/${this.githubRepo}/contents/${basePath}/${skillName}?ref=${tag}`;

      // 使用Promise.race实现超时控制
      const downloadPromise = this.downloadDirectory(apiUrl, skillTempDir);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Download timeout: 60s')), 60000),
      );

      await Promise.race([downloadPromise, timeoutPromise]);
      return skillTempDir;
    } catch (error) {
      console.warn(
        `Failed to download skill ${skillName} from GitHub: ${(error as Error).message}`,
      );

      // 2. 下载失败，提示失败并安装本地技能
      console.log(`Installing local skill: ${skillName}`);

      const packageDir = path.join(__dirname, '..');
      const skillsDir =
        language === 'zh'
          ? path.join(packageDir, 'skills-zh', skillName)
          : path.join(packageDir, 'skills', skillName);

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
      return vA.prerelease.localeCompare(vB.prerelease);
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
      const apiUrl = `https://api.github.com/repos/${this.githubOwner}/${this.githubRepo}/contents/${basePath}?ref=${tag}`;
      const listPromise = this.makeRequest(apiUrl) as Promise<GitHubContent[]>;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('List skills timeout: 60s')), 60000),
      );

      const contents = await Promise.race([listPromise, timeoutPromise]);
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
      const skillPath = path.join(skillsDir, skillName);
      return {
        name: skillName,
        path: skillPath,
        description: this.extractDescription(skillPath, skillName),
        version: 'local',
      };
    });
  }

  private copyDirectorySync(src: string, dest: string): void {
    // 防止递归嵌套：检查目标路径是否是源路径的子目录
    const srcResolved = path.resolve(src);
    const destResolved = path.resolve(dest);

    if (destResolved.startsWith(srcResolved) && destResolved !== srcResolved) {
      throw new Error(`Cannot copy directory into itself: ${src} -> ${dest}`);
    }

    // 清理目标目录并创建新目录
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
    }
    fs.mkdirSync(dest, { recursive: true });

    const items = fs.readdirSync(src, { withFileTypes: true });
    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isDirectory()) {
        this.copyDirectorySync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
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
