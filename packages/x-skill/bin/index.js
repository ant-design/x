#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');
const { emojis, messages } = require('./locale/index.js');

class SkillInstaller {
  constructor() {
    this.skills = [];
    this.language = 'zh';
    this.messages = this.loadLocaleMessages();

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.skillConfig = this.loadConfig();
    this.loadSkills();
  }

  loadConfig() {
    const configPath = path.join(__dirname, '..', '.skill.json');
    try {
      const configData = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('Failed to load skill config:', error);
      process.exit(1);
    }
  }

  loadLocaleMessages() {
    try {
      return messages;
    } catch (error) {
      console.error('Failed to load locale messages:', error);
      return messages;
    }
  }

  loadSkills() {
    const skillsDir = path.join(__dirname, '..', 'skills');
    try {
      const skillDirs = fs
        .readdirSync(skillsDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      this.skills = skillDirs.map((skillName) => {
        const skillPath = path.join(skillsDir, skillName);
        let description = '';
        const skillMdPath = path.join(skillPath, 'SKILL.md');

        if (fs.existsSync(skillMdPath)) {
          try {
            const content = fs.readFileSync(skillMdPath, 'utf-8');
            const firstLine = content.split('\n')[0];
            description = firstLine.replace(/^#\s*/, '').trim();
            // 如果描述为空、只有破折号或与技能名相同，则不显示描述
            if (
              !description ||
              description === '-' ||
              description === '---' ||
              description === skillName
            ) {
              description = '';
            }
          } catch (_e) {
            description = '';
          }
        }

        return {
          name: skillName,
          path: skillPath,
          description: description || skillName,
        };
      });
    } catch (error) {
      console.error('Failed to load skills:', error);
      process.exit(1);
    }
  }

  askQuestion(question, options) {
    return new Promise((resolve) => {
      console.log(`\n${this.colorize(`❓ ${question}`, 'cyan')}`);
      this.printSeparator();
      options.forEach((option, index) => {
        const number = this.colorize(`${index + 1}.`, 'yellow');
        console.log(`   ${number} ${option}`);
      });
      this.printSeparator();

      this.rl.question(
        this.colorize(this.getMessage('pleaseSelectNumber'), 'green'),
        async (answer) => {
          const index = parseInt(answer.trim(), 10) - 1;
          if (index >= 0 && index < options.length) {
            console.log(
              `\n${emojis.check} ${this.getMessage('yourChoice')} ${this.colorize(options[index], 'green')}\n`,
            );
            resolve(options[index]);
          } else {
            console.log(
              `${emojis.warning} ${this.colorize(this.getMessage('invalidChoice'), 'red')}`,
            );
            const result = await this.askQuestion(question, options);
            resolve(result);
          }
        },
      );
    });
  }

  askMultipleChoice(question, options) {
    return new Promise((resolve) => {
      console.log(`\n${this.colorize(`✨ ${question}`, 'cyan')}`);
      this.printSeparator();
      options.forEach((option, index) => {
        const checkbox = this.colorize('[ ]', 'dim');
        const number = this.colorize(`${index + 1}.`, 'yellow');
        console.log(`   ${checkbox} ${number} ${option}`);
      });
      this.printSeparator();

      this.rl.question(this.colorize(this.getMessage('pleaseSelect'), 'green'), async (answer) => {
        const indices = answer
          .trim()
          .split(',')
          .map((s) => parseInt(s.trim(), 10) - 1);
        const selected = indices.filter((i) => i >= 0 && i < options.length).map((i) => options[i]);

        if (selected.length > 0) {
          console.log(`\n${emojis.check} ${this.getMessage('yourChoice')}`);
          selected.forEach((item) => {
            console.log(`   ${this.colorize(`• ${item}`, 'green')}`);
          });
          resolve(selected);
        } else {
          console.log(`${emojis.warning} ${this.colorize(this.getMessage('noSelection'), 'red')}`);
          const result = await this.askMultipleChoice(question, options);
          resolve(result);
        }
      });
    });
  }

  getMessage(key, replacements = {}, lang = null) {
    const targetLang = lang || this.language;
    let message = this.messages[targetLang][key] || key;
    // 替换模板变量
    Object.keys(replacements).forEach((placeholder) => {
      message = message.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
    });
    return message;
  }

  // 添加彩色输出方法
  colorize(text, color) {
    const colorMap = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
      bright: '\x1b[1m',
      dim: '\x1b[2m',
      reset: '\x1b[0m',
    };
    return `${colorMap[color] || ''}${text}${colorMap.reset}`;
  }

  // 添加标题艺术字
  printHeader() {
    console.log(`${this.colorize('╔══════════════════════════════════╗', 'cyan')}
${this.colorize('║', 'cyan')}    ${emojis.rocket} ${this.colorize('X-Skill 安装器', 'bright')} ${emojis.sparkles}    ${this.colorize('      ║', 'cyan')}
${this.colorize('║', 'cyan')}    ${this.colorize('让开发变得更简单、更有趣！', 'dim')}    ${this.colorize('║', 'cyan')}
${this.colorize('╚══════════════════════════════════╝', 'cyan')}`);
  }

  // 添加加载动画
  startSpinner(text) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let frameIndex = 0;
    this.spinnerInterval = setInterval(() => {
      const frame = frames[frameIndex];
      process.stdout.write(`\r${this.colorize(frame, 'cyan')} ${text}`);
      frameIndex = (frameIndex + 1) % frames.length;
    }, 100);
  }

  stopSpinner() {
    if (this.spinnerInterval) {
      clearInterval(this.spinnerInterval);
      this.spinnerInterval = null;
      process.stdout.write('\r');
    }
  }

  // 添加进度条 - 只显示一个持续更新的进度条
  printProgressBar(current, total, text = '') {
    const percentage = Math.round((current / total) * 100);
    const barLength = 30;
    const filledLength = Math.round((barLength * current) / total);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

    // 使用 \r 回到行首，覆盖之前的进度条
    process.stdout.write(
      `\r${this.colorize('[', 'green')}${this.colorize(bar, 'green')}${this.colorize(']', 'green')} ${percentage}% ${text}`,
    );

    // 只在完成时换行
    if (current === total && current > 0) {
      console.log(); // 换行
    }
  }

  // 严格控制的单行进度条
  updateSingleProgressBar(current, total, text = '') {
    const percentage = Math.round((current / total) * 100);
    const barLength = 30;
    const filledLength = Math.round((barLength * current) / total);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

    // 严格控制：清除整行后显示
    const line = `${this.colorize('[', 'green')}${this.colorize(bar, 'green')}${this.colorize(']', 'green')} ${percentage}% ${text}`;
    // 使用 stdout 并严格控制输出
    process.stdout.write(`\r${line.padEnd(80)}`);
  }

  // 添加装饰性分隔符
  printSeparator() {
    console.log(this.colorize('─'.repeat(50), 'dim'));
  }

  async run() {
    try {
      this.printHeader();

      // 显示欢迎信息（使用默认英文）
      console.log(`\n${this.colorize(this.getMessage('welcome', {}, 'en'), 'bright')}`);
      console.log(this.colorize(this.getMessage('welcomeSub', {}, 'en'), 'dim'));

      // 语言选择 - 双语显示
      const languageChoice = await this.askQuestion(this.getMessage('selectLanguage'), [
        '中文',
        'English',
      ]);
      this.language = languageChoice === '中文' ? 'zh' : 'en';

      // 显示技能列表
      console.log(`\n${this.colorize(this.getMessage('foundSkills'), 'cyan')}`);
      const skillOptions = this.skills.map(
        (skill) =>
          `${skill.name}${skill.description && skill.description !== skill.name ? ` - ${skill.description}` : ''}`,
      );

      const selectedSkills = await this.askMultipleChoice(
        this.getMessage('selectSkills'),
        skillOptions,
      );
      const selectedSkillNames = selectedSkills.map((s) => s.split(' - ')[0]);

      console.log(`\n${this.colorize(this.getMessage('availableSoftware'), 'cyan')}`);
      const softwareOptions = Object.entries(this.skillConfig.targets)
        .filter(([_, config]) => config.enabled)
        .map(([name]) => name);

      const selectedSoftwareList = await this.askMultipleChoice(
        this.getMessage('selectSoftware'),
        softwareOptions,
      );

      // 安装方式选择
      const installTypeOptions = [
        this.getMessage('globalInstall'),
        this.getMessage('projectInstall'),
      ];

      const selectedInstallType = await this.askQuestion(
        this.getMessage('selectInstallType'),
        installTypeOptions,
      );
      const isGlobal = selectedInstallType === this.getMessage('globalInstall');

      // 安装过程
      process.stdout.write(`${this.colorize(this.getMessage('copyingFiles'), 'yellow')} `);

      const totalSteps = selectedSoftwareList.length * selectedSkillNames.length;
      let currentStep = 0;

      // 只显示一次进度条，持续更新
      const allTasks = [];
      for (const software of selectedSoftwareList) {
        for (const skillName of selectedSkillNames) {
          allTasks.push({ skillName, software });
        }
      }

      // 开始安装，进度条将在循环中更新

      for (const task of allTasks) {
        const { skillName, software } = task;
        const progressMsg = `${skillName} -> ${software}`;

        // 更新单行进度条
        this.updateSingleProgressBar(currentStep, totalSteps, progressMsg);

        await this.installSkills([skillName], software, isGlobal);

        currentStep++;
      }

      // 完成时显示100%
      // 清理行尾并显示完成
      process.stdout.write(`\r${' '.repeat(80)}\r`);
      process.stdout.write(`\r${' '.repeat(80)}\r`);
      this.updateSingleProgressBar(totalSteps, totalSteps, this.getMessage('allComplete'));

      // 完成动画
      console.log(`\n\n${this.colorize(this.messages[this.language].startUsing, 'bright')}`);
      console.log(
        `\n${this.colorize(this.messages[this.language].thankYou, 'magenta')} ${emojis.heart}`,
      );
    } catch (error) {
      this.stopSpinner();
      console.error(
        `\n${this.colorize(`${emojis.cross} ${this.getMessage('installFailed')}`, 'red')}\n`,
        error.message,
      );
    } finally {
      console.log(`\n${this.colorize(this.getMessage('goodbye'), 'cyan')}\n\n`);
      this.rl.close();
    }
  }

  async installSkills(skillNames, software, isGlobal) {
    const targetConfig = this.skillConfig.targets[software];
    if (!targetConfig) {
      throw new Error(`软件 ${software} 在配置中未找到`);
    }

    const targetPath = isGlobal ? targetConfig.paths.global : targetConfig.paths.project;
    const fullTargetPath = isGlobal
      ? path.join(os.homedir(), targetPath)
      : path.join(process.cwd(), targetPath);

    if (!fs.existsSync(fullTargetPath)) {
      fs.mkdirSync(fullTargetPath, { recursive: true });
    }

    for (const skillName of skillNames) {
      const skill = this.skills.find((s) => s.name === skillName);
      if (!skill) {
        // 静默跳过未找到的技能，不输出警告
        continue;
      }

      const sourcePath = skill.path;
      const destPath = path.join(fullTargetPath, skillName);

      try {
        if (fs.existsSync(destPath)) {
          // 静默删除已存在的技能，不输出更新提示
          fs.rmSync(destPath, { recursive: true, force: true });
        }

        this.copyDirectory(sourcePath, destPath);
        // 静默完成安装，不输出详细信息
      } catch (error) {
        // 静默处理错误，让上层处理
        throw error;
      }
    }
  }

  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

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

// 导出类供测试使用
module.exports = { SkillInstaller };

// 如果是直接运行，则执行
if (require.main === module) {
  const installer = new SkillInstaller();
  installer.run().catch(console.error);
}
