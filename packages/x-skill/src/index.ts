#!/usr/bin/env node

import fs from 'fs';
import ora from 'ora';
import os from 'os';
import path from 'path';
import ProgressBar from 'progress';
import readline from 'readline';
import SkillLoader from './getSkillRepo';
import HelpManager from './help';
import { emojis, getMessage, Language, LocaleMessages, messages } from './locale/index';

interface SkillConfig {
  targets: {
    [key: string]: {
      enabled: boolean;
      paths: {
        global: string;
        project: string;
      };
    };
  };
}

interface ParsedArgs {
  tag: string | null;
  help: boolean;
  listVersions: boolean;
}

interface Skill {
  name: string;
  path: string;
  description: string;
  version: string;
}

class SkillInstaller {
  private skills: Skill[] = [];
  private language: Language = 'zh';
  private rl: readline.Interface;
  private skillConfig: SkillConfig;
  private skillLoader: SkillLoader;
  private helpManager: HelpManager;
  private args: ParsedArgs;
  private cacheDir: string;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.skillConfig = this.loadConfig();
    this.skillLoader = new SkillLoader({
      githubOwner: 'ant-design',
      githubRepo: 'x',
      tempDir: path.join(os.tmpdir(), 'x-skill-temp'),
    });
    this.cacheDir = path.join(os.tmpdir(), 'x-skill-cache');
    fs.mkdirSync(this.cacheDir, { recursive: true });

    this.helpManager = new HelpManager();

    // Parse command line arguments
    this.args = this.parseArgs();
  }

  questionAsync(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  printSeparator(): void {
    this.helpManager.printSeparator();
  }

  parseArgs(): ParsedArgs {
    const args = process.argv.slice(2);
    const parsed: ParsedArgs = { tag: null, help: false, listVersions: false };

    // 检测系统语言环境，默认为英文
    const systemLang = (process.env.LANG || process.env.LANGUAGE || '').toLowerCase();
    const defaultLanguage = systemLang.includes('zh') ? 'zh' : 'en';

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      switch (arg) {
        case '-t':
        case '--tag':
          if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
            parsed.tag = args[++i];
          } else {
            console.error(getMessage('tagValueRequired', defaultLanguage));
            process.exit(1);
          }
          break;
        case '-l':
        case '--list-versions':
          parsed.listVersions = true;
          break;
        case '-h':
        case '--help':
          parsed.help = true;
          break;
        case '-v':
        case '-V':
        case '--version':
          this.helpManager.showVersion();
          process.exit(0);
          break;
        default:
          if (arg.startsWith('-')) {
            console.error(`${getMessage('unknownOption', defaultLanguage)} '${arg}'`);
            console.error(getMessage('useHelp', defaultLanguage));
            process.exit(1);
          }
          break;
      }
    }

    return parsed;
  }

  /**
   * 处理非交互式命令
   * @returns 如果处理了非交互式命令则返回true，否则返回false
   */
  handleNonInteractiveCommands(): boolean {
    if (this.args.help) {
      this.showHelp();
      return true;
    }

    if (this.args.listVersions) {
      this.listVersions().then(() => process.exit(0));
      return true;
    }

    return false;
  }

  showHelp(): void {
    this.helpManager.showHelp();
  }

  loadConfig(): SkillConfig {
    const configPath = path.join(__dirname, '..', '.skill.json');
    const configData = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configData);
  }

  loadLocaleMessages(): LocaleMessages {
    return messages.zh;
  }

  getCache(key: string): any {
    const cacheFile = path.join(this.cacheDir, `${key}.json`);
    if (!fs.existsSync(cacheFile)) {
      return null;
    }

    const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
    if (Date.now() > cacheData.expires) {
      fs.unlinkSync(cacheFile);
      return null;
    }

    return cacheData.data;
  }

  setCache(key: string, data: any, ttlSeconds = 3600): void {
    const cacheFile = path.join(this.cacheDir, `${key}.json`);
    const cacheData = {
      data,
      expires: Date.now() + ttlSeconds * 1000,
    };

    fs.writeFileSync(cacheFile, JSON.stringify(cacheData));
  }

  clearCache(key: string): void {
    const cacheFile = path.join(this.cacheDir, `${key}.json`);
    if (fs.existsSync(cacheFile)) {
      fs.unlinkSync(cacheFile);
    }
  }

  async listVersions(): Promise<void> {
    try {
      const spinner = ora(
        this.helpManager.colorize(getMessage('fetchingVersions', this.language), 'cyan'),
      ).start();
      const versions = await this.skillLoader.listVersions();
      spinner.stop();

      if (versions.length === 0) {
        console.log(
          `${this.helpManager.colorize(getMessage('noVersionsFound', this.language), 'yellow')}`,
        );
        return;
      }

      console.log(
        `${this.helpManager.colorize(getMessage('availableVersions', this.language), 'green')}`,
      );
      versions.forEach((version, index) => {
        const marker = index === 0 ? getMessage('latestMarker', this.language) : '';
        console.log(`  ${this.helpManager.colorize(version, 'yellow')}${marker}`);
      });
    } catch (error) {
      console.error(
        `${this.helpManager.colorize(getMessage('error', this.language), 'red')} ${(error as Error).message}`,
      );
    }
  }

  async loadSkills(): Promise<void> {
    try {
      console.log(
        `${this.helpManager.colorize(getMessage('fetchingSkills', this.language), 'cyan')}`,
      );
      const version = this.args.tag || 'latest';
      const skills = await this.skillLoader.loadSkills(version, this.language);
      this.skills = skills;

      // 缓存结果
      this.setCache(`skills_${skills[0]?.version || version}`, this.skills, 1800); // 缓存30分钟
    } catch (error) {
      if ((error as Error).message.includes('rate limit')) {
        console.error(
          `${this.helpManager.colorize(getMessage('rateLimitError', this.language, { message: (error as Error).message }), 'red')}\n`,
        );
        console.log(
          `${this.helpManager.colorize(getMessage('info', this.language), 'cyan')} ${getMessage('rateLimitHint', this.language)}`,
        );
      } else {
        console.error(
          `${this.helpManager.colorize(getMessage('githubFetchError', this.language, { message: (error as Error).message }), 'red')}`,
        );
      }

      // Fallback to local skills if GitHub fails
      console.log(
        `${this.helpManager.colorize(getMessage('usingLocalSkills', this.language), 'yellow')}`,
      );
      await this.loadLocalSkills();

      if (this.skills.length === 0) {
        console.log(
          `${emojis.warning} ${this.helpManager.colorize(getMessage('noLocalSkills', this.language), 'yellow')}`,
        );
      }
    }
  }

  async loadLocalSkills(): Promise<void> {
    this.skills = await this.skillLoader.loadLocalSkills(this.language);
  }

  async askQuestion(question: string, options: string[]): Promise<string | null> {
    // 防止空选项数组导致的无限递归
    if (!options || options.length === 0) {
      console.log(
        `${emojis.warning} ${this.helpManager.colorize(getMessage('noSelection', this.language), 'red')}`,
      );
      return null;
    }

    console.log(`\n${this.helpManager.colorize(`❓ ${question}`, 'cyan')}`);
    this.printSeparator();
    options.forEach((option, index) => {
      const number = this.helpManager.colorize(`${index + 1}.`, 'yellow');
      console.log(`   ${number} ${option}`);
    });
    this.printSeparator();

    let attempts = 0;
    const maxAttempts = 3;

    console.log(
      this.helpManager.colorize(`💡 ${getMessage('inputNumberTip', this.language)}`, 'dim'),
    );

    while (attempts < maxAttempts) {
      try {
        const answer = await this.questionAsync(
          this.helpManager.colorize('➤ ', 'green') +
            getMessage('pleaseSelectNumber', this.language),
        );

        if (!answer || answer.trim() === '') {
          console.log(
            `${emojis.warning} ${this.helpManager.colorize(getMessage('inputEmpty', this.language), 'red')}`,
          );
          attempts++;
          continue;
        }

        const index = parseInt(answer.trim(), 10) - 1;
        if (index >= 0 && index < options.length) {
          console.log(
            `\n${emojis.check} ${getMessage('yourChoice', this.language)} ${this.helpManager.colorize(options[index], 'green')}\n`,
          );
          return options[index];
        }
        console.log(
          `${emojis.warning} ${this.helpManager.colorize(getMessage('invalidChoice', this.language), 'red')}`,
        );
        attempts++;
      } catch (error) {
        console.error(
          `${emojis.cross} ${this.helpManager.colorize(getMessage('error', this.language), 'red')} ${(error as Error).message}`,
        );
        attempts++;
      }
    }

    console.error(
      `${emojis.cross} ${this.helpManager.colorize(getMessage('maxAttemptsExceeded', this.language), 'red')}`,
    );
    process.exit(1);
  }

  async askMultipleChoice(question: string, options: string[]): Promise<string[]> {
    // 防止空选项数组导致的无限递归
    if (!options || options.length === 0) {
      console.log(
        `${emojis.warning} ${this.helpManager.colorize(getMessage('noSelection', this.language), 'red')}`,
      );
      return [];
    }

    console.log(`\n${this.helpManager.colorize(`✨ ${question}`, 'cyan')}`);
    options.forEach((option, index) => {
      const checkbox = this.helpManager.colorize('[ ]', 'dim');
      const number = this.helpManager.colorize(`${index + 1}.`, 'yellow');
      console.log(`   ${checkbox} ${number} ${option}`);
    });
    console.log(''); // 添加空行让提示更清晰

    let attempts = 0;
    const maxAttempts = 3;

    console.log(
      this.helpManager.colorize(`💡 ${getMessage('inputMultipleTip', this.language)}`, 'dim'),
    );

    while (attempts < maxAttempts) {
      try {
        const answer = await this.questionAsync(
          this.helpManager.colorize('➤ ', 'green') + getMessage('pleaseSelect', this.language),
        );

        if (!answer || answer.trim() === '') {
          console.log(
            `${emojis.warning} ${this.helpManager.colorize(getMessage('inputEmpty', this.language), 'red')}`,
          );
          attempts++;
          continue;
        }

        const indices = answer
          .trim()
          .split(',')
          .map((s) => parseInt(s.trim(), 10) - 1)
          .filter((i) => !isNaN(i) && i >= 0 && i < options.length);

        const selected = indices.map((i) => options[i]);

        if (selected.length > 0) {
          console.log(`\n${emojis.check} ${getMessage('yourChoice', this.language)}`);
          selected.forEach((item) => {
            console.log(`   ${this.helpManager.colorize(`• ${item}`, 'green')}`);
          });
          return selected;
        }
        console.log(
          `${emojis.warning} ${this.helpManager.colorize(getMessage('invalidInput', this.language), 'red')}`,
        );
        attempts++;
      } catch (error) {
        console.error(
          `${emojis.cross} ${this.helpManager.colorize(getMessage('error', this.language), 'red')} ${(error as Error).message}`,
        );
        attempts++;
      }
    }

    console.error(
      `${emojis.cross} ${this.helpManager.colorize(getMessage('maxAttemptsExceeded', this.language), 'red')}`,
    );
    process.exit(1);
  }

  // Progress bar using progress library
  createProgressBar(total: number): ProgressBar {
    return new ProgressBar(
      `  ${this.helpManager.colorize(':bar', 'green')} ${this.helpManager.colorize(':percent', 'cyan')} ${this.helpManager.colorize(':current/:total', 'yellow')} ${this.helpManager.colorize(':etas', 'magenta')} ${this.helpManager.colorize('→', 'dim')} :text`,
      {
        total: total,
        complete: '█',
        incomplete: '░',
        width: 30,
      },
    );
  }

  async run(): Promise<void> {
    // 首先处理非交互式命令
    if (this.handleNonInteractiveCommands()) {
      return;
    }

    try {
      await this.helpManager.printHeader();

      // Display version info if specified
      if (this.args.tag) {
        console.log(
          `${this.helpManager.colorize(getMessage('usingVersion', this.language, { version: this.args.tag }), 'cyan')}`,
        );
      }

      // 短暂延迟以避免自动输入问题
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Language selection - bilingual display with dual language prompt
      this.helpManager.printLanguageSelection();

      let languageChoice: string;
      while (true) {
        const answer = await this.questionAsync(
          this.helpManager.colorize(
            `${getMessage('selectLanguagePrompt', this.language)}: `,
            'green',
          ),
        );
        const choice = answer.trim();
        if (choice === '1' || choice.toLowerCase() === 'zh') {
          console.log(`\n${emojis.check} 你选择了中文\n`);
          languageChoice = '中文';
          break;
        }
        if (choice === '2' || choice.toLowerCase() === 'en') {
          console.log(`\n${emojis.check} You selected English\n`);
          languageChoice = 'English';
          break;
        }
        console.log(
          `${emojis.warning} ${this.helpManager.colorize('无效选择，请重新输入 / Invalid choice, please try again', 'red')}`,
        );
      }

      this.language = languageChoice === '中文' ? 'zh' : 'en';

      // 更新HelpManager的语言设置
      this.helpManager.setLanguage(this.language);

      // Load skills from GitHub
      await this.loadSkills();

      const skillOptions = this.skills.map(
        (skill) =>
          `${skill.name}${skill.description && skill.description !== skill.name ? ` - ${skill.description}` : ''}`,
      );

      if (skillOptions.length === 0) {
        console.log(
          `${emojis.warning} ${this.helpManager.colorize(getMessage('noSkillsFound', this.language), 'yellow')}`,
        );
        return;
      }

      let selectedSkills: string[] = [];
      while (selectedSkills.length === 0) {
        selectedSkills = await this.askMultipleChoice(
          getMessage('selectSkills', this.language),
          skillOptions,
        );

        if (selectedSkills.length === 0) {
          console.log(
            `${emojis.warning} ${this.helpManager.colorize(getMessage('selectAtLeastOneSkill', this.language), 'yellow')}`,
          );
        }
      }

      const selectedSkillNames = selectedSkills.map((s) => s.split(' - ')[0]);

      const softwareOptions = Object.entries(this.skillConfig.targets)
        .filter(([_, config]) => config.enabled)
        .map(([name]) => name);

      if (softwareOptions.length === 0) {
        console.log(
          `${emojis.warning} ${this.helpManager.colorize(getMessage('noSoftwareFound', this.language), 'yellow')}`,
        );
        return;
      }

      let selectedSoftwareList: string[] = [];
      while (selectedSoftwareList.length === 0) {
        selectedSoftwareList = await this.askMultipleChoice(
          getMessage('selectSoftware', this.language),
          softwareOptions,
        );

        if (selectedSoftwareList.length === 0) {
          console.log(
            `${emojis.warning} ${this.helpManager.colorize(getMessage('selectAtLeastOneSoftware', this.language), 'yellow')}`,
          );
        }
      }

      // Installation method selection
      const installTypeOptions = [
        getMessage('globalInstall', this.language),
        getMessage('projectInstall', this.language),
      ];

      let selectedInstallType: string | null = null;
      while (!selectedInstallType) {
        selectedInstallType = await this.askQuestion(
          getMessage('selectInstallType', this.language),
          installTypeOptions,
        );
      }

      const isGlobal = selectedInstallType === getMessage('globalInstall', this.language);

      // Installation process
      const totalSteps = selectedSoftwareList.length * selectedSkillNames.length;

      if (totalSteps > 0) {
        const progressBar = this.createProgressBar(totalSteps);

        const allTasks = [];
        for (const software of selectedSoftwareList) {
          for (const skillName of selectedSkillNames) {
            allTasks.push({ skillName, software });
          }
        }

        for (const task of allTasks) {
          const { skillName, software } = task;
          try {
            await this.installSkills([skillName], software, isGlobal);
            progressBar.tick({
              text: `${skillName} -> ${software}`,
            });
          } catch (installError) {
            console.error(
              `${emojis.cross} ${this.helpManager.colorize(getMessage('installError', this.language, { skill: skillName, error: (installError as Error).message }), 'red')}`,
            );
            progressBar.tick({
              text: `${skillName} -> ${software} ${getMessage('installationFailed', this.language)}`,
            });
          }
        }
      }
      // Completion animation
      this.helpManager.printCompletion();

      // Ensure process exits properly
      process.exit(0);
    } catch (error) {
      if (
        (error as Error).message.includes('Input stream ended') ||
        (error as Error).message.includes('Readline interface is closed')
      ) {
        console.error(
          `${emojis.cross} ${this.helpManager.colorize(getMessage('programInterrupted'), 'red')}`,
        );
      } else {
        this.helpManager.printError(error as Error);
      }
    } finally {
      if (this.rl && !(this.rl as any).closed) {
        this.rl.close();
      }
    }
  }

  async installSkills(skillNames: string[], software: string, isGlobal: boolean): Promise<void> {
    const targetConfig = this.skillConfig.targets[software];
    const targetPath = isGlobal ? targetConfig.paths.global : targetConfig.paths.project;
    const fullTargetPath = isGlobal
      ? path.join(os.homedir(), targetPath)
      : path.join(process.cwd(), targetPath);

    fs.mkdirSync(fullTargetPath, { recursive: true });

    for (const skillName of skillNames) {
      const skill = this.skills.find((s) => s.name === skillName);
      if (!skill) continue;

      const sourcePath = skill.path;
      const destPath = path.join(fullTargetPath, skillName);

      if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true, force: true });
      }

      this.copyDirectory(sourcePath, destPath);
    }
  }

  copyDirectory(src: string, dest: string): void {
    fs.mkdirSync(dest, { recursive: true });

    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

// Export class for testing purposes
export { SkillInstaller };

// 直接运行时执行
const installer = new SkillInstaller();
installer.run().catch(console.error);
