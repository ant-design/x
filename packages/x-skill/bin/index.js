#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');

class SkillInstaller {
  constructor() {
    this.skills = [];
    this.language = 'zh';
    this.messages = this.loadI18nMessages();

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

  loadI18nMessages() {
    const i18nPath = path.join(__dirname, '..', 'config', 'i18n.json');
    try {
      const i18nData = fs.readFileSync(i18nPath, 'utf-8');
      return JSON.parse(i18nData);
    } catch (error) {
      console.error('Failed to load i18n messages:', error);
      // 如果加载失败，返回默认消息
      return {
        zh: {
          selectLanguage: '请选择语言 (Select language):',
          selectSkills: '请选择要安装的技能 (可多选):',
          selectSoftware: '请选择目标软件 (可多选)',
          selectInstallType: '请选择安装方式:',
          installComplete: '安装完成!',
          installFailed: '安装失败:',
          copyingFiles: '正在拷贝文件...',
          globalInstall: '全局安装',
          projectInstall: '项目安装',
          confirm: '确认选择',
          cancel: '取消',
          installingTo: '正在安装到',
          packageSymbol: '📦',
        },
        en: {
          selectLanguage: 'Select language:',
          selectSkills: 'Select skills to install (multiple selection):',
          selectSoftware: 'Select target software (multiple selection):',
          selectInstallType: 'Select installation type:',
          installComplete: 'Installation complete!',
          installFailed: 'Installation failed:',
          copyingFiles: 'Copying files...',
          globalInstall: 'Global install',
          projectInstall: 'Project install',
          confirm: 'Confirm',
          cancel: 'Cancel',
          installingTo: 'Installing to',
          packageSymbol: '📦',
        },
      };
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
          } catch (e) {
            description = skillName;
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
      console.log(`\n${question}`);
      options.forEach((option, index) => {
        console.log(`${index + 1}. ${option}`);
      });

      this.rl.question('请选择 (Enter number): ', async (answer) => {
        const index = parseInt(answer.trim()) - 1;
        if (index >= 0 && index < options.length) {
          resolve(options[index]);
        } else {
          console.log('无效选择，请重试');
          const result = await this.askQuestion(question, options);
          resolve(result);
        }
      });
    });
  }

  askMultipleChoice(question, options) {
    return new Promise((resolve) => {
      console.log(`\n${question}`);
      options.forEach((option, index) => {
        console.log(`${index + 1}. ${option}`);
      });
      console.log('请输入数字，用逗号分隔 (e.g., 1,3,5)');

      this.rl.question('选择: ', async (answer) => {
        const indices = answer
          .trim()
          .split(',')
          .map((s) => parseInt(s.trim()) - 1);
        const selected = indices.filter((i) => i >= 0 && i < options.length).map((i) => options[i]);

        if (selected.length > 0) {
          resolve(selected);
        } else {
          console.log('请至少选择一个选项');
          const result = await this.askMultipleChoice(question, options);
          resolve(result);
        }
      });
    });
  }

  getMessage(key) {
    return this.messages[this.language][key];
  }

  async run() {
    try {
      const languageChoice = await this.askQuestion(this.getMessage('selectLanguage'), [
        '中文',
        'English',
      ]);
      this.language = languageChoice === '中文' ? 'zh' : 'en';

      const skillOptions = this.skills.map(
        (skill) => `${skill.name}${skill.description ? ` - ${skill.description}` : ''}`,
      );

      const selectedSkills = await this.askMultipleChoice(
        this.getMessage('selectSkills'),
        skillOptions,
      );
      const selectedSkillNames = selectedSkills.map((s) => s.split(' - ')[0]);

      const softwareOptions = Object.entries(this.skillConfig.targets)
        .filter(([_, config]) => config.enabled)
        .map(([name]) => name);

      const selectedSoftwareList = await this.askMultipleChoice(
        this.getMessage('selectSoftware'),
        softwareOptions,
      );

      const installTypeOptions = [
        this.getMessage('globalInstall'),
        this.getMessage('projectInstall'),
      ];

      const selectedInstallType = await this.askQuestion(
        this.getMessage('selectInstallType'),
        installTypeOptions,
      );
      const isGlobal = selectedInstallType === this.getMessage('globalInstall');

      console.log(`\n${this.getMessage('copyingFiles')}`);
      for (const software of selectedSoftwareList) {
        console.log(
          `\n${this.getMessage('packageSymbol')} ${this.getMessage('installingTo')} ${software}...`,
        );
        await this.installSkills(selectedSkillNames, software, isGlobal);
      }
      console.log(`\n✅ ${this.getMessage('installComplete')}`);
    } catch (error) {
      console.error(`\n❌ ${this.getMessage('installFailed')}`, error);
    } finally {
      this.rl.close();
    }
  }

  async installSkills(skillNames, software, isGlobal) {
    const targetConfig = this.skillConfig.targets[software];
    if (!targetConfig) {
      throw new Error(`Software ${software} not found in config`);
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
      if (!skill) continue;

      const sourcePath = skill.path;
      const destPath = path.join(fullTargetPath, skillName);

      if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true, force: true });
      }

      this.copyDirectory(sourcePath, destPath);
      console.log(`  ✓ ${skillName} -> ${destPath}`);
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
