/**
 * 技能API配置
 * 将硬编码的路径移至配置文件中，提高灵活性和可维护性
 */

import * as path from 'path';

export interface SkillConfig {
  [skillName: string]: string;
}

export interface Config {
  zh: SkillConfig;
  en: SkillConfig;
  paths: {
    /** 中文技能目录 */
    skillsZhDir: string;
    /** 英文技能目录 */
    skillsEnDir: string;
    /** 项目根目录 */
    rootDir: string;
    /** bin目录 */
    binDir: string;
    /** .claude-plugin目录 */
    claudePluginDir: string;
    /** marketplace.json文件路径 */
    marketplaceJsonPath: string;
    /** package.json文件路径 */
    packageJsonPath: string;
  };
}

// 基于当前文件位置计算相对路径
const scriptDir = __dirname;
const projectRoot = path.join(scriptDir, '..');

// 原有的文档链接配置
const skillConfig: Config = {
  zh: {
    'use-x-chat': 'packages/x/docs/x-sdk/use-x-chat.zh-CN.md',
    'x-request': 'packages/x/docs/x-sdk/x-request.zh-CN.md',
  },
  en: {
    'use-x-chat': 'packages/x/docs/x-sdk/use-x-chat.en-US.md',
    'x-request': 'packages/x/docs/x-sdk/x-request.en-US.md',
  },
  paths: {
    // 中文技能目录
    skillsZhDir: path.join(projectRoot, 'skills-zh'),
    // 英文技能目录
    skillsEnDir: path.join(projectRoot, 'skills'),
    // 项目根目录
    rootDir: projectRoot,
    // bin目录
    binDir: path.join(projectRoot, 'bin'),
    // .claude-plugin目录
    claudePluginDir: path.join(projectRoot, '.claude-plugin'),
    // marketplace.json文件路径
    marketplaceJsonPath: path.join(projectRoot, '.claude-plugin', 'marketplace.json'),
    // package.json文件路径
    packageJsonPath: path.join(projectRoot, 'package.json'),
  },
};

export default skillConfig;
