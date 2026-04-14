/**
 * 技能API配置
 * 将硬编码的路径移至配置文件中，提高灵活性和可维护性
 */

import * as path from 'path';
import { fileURLToPath } from 'url';

export interface SkillConfig {
  [skillName: string]: string | string[];
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

// 基于当前文件位置计算相对路径（兼容ES模块）
const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const projectRoot = path.join(scriptDir, '..');

// 原有的文档链接配置
const skillConfig: Config = {
  zh: {
    'use-x-chat': [
      'packages/x/docs/x-sdk/use-x-chat.zh-CN.md',
      'packages/x/docs/x-sdk/use-x-conversations.zh-CN.md',
    ],
    'x-request': 'packages/x/docs/x-sdk/x-request.zh-CN.md',
    'x-markdown': 'packages/x/docs/x-markdown/examples.zh-CN.md',
    'x-components': [
      'packages/x/components/bubble/index.zh-CN.md',
      'packages/x/components/sender/index.zh-CN.md',
      'packages/x/components/conversations/index.zh-CN.md',
      'packages/x/components/welcome/index.zh-CN.md',
      'packages/x/components/prompts/index.zh-CN.md',
      'packages/x/components/attachments/index.zh-CN.md',
      'packages/x/components/suggestion/index.zh-CN.md',
      'packages/x/components/think/index.zh-CN.md',
      'packages/x/components/thought-chain/index.zh-CN.md',
      'packages/x/components/actions/index.zh-CN.md',
      'packages/x/components/file-card/index.zh-CN.md',
      'packages/x/components/sources/index.zh-CN.md',
      'packages/x/components/code-highlighter/index.zh-CN.md',
      'packages/x/components/mermaid/index.zh-CN.md',
      'packages/x/components/x-provider/index.zh-CN.md',
      'packages/x/components/notification/index.zh-CN.md',
      'packages/x/components/folder/index.zh-CN.md',
    ],
  },
  en: {
    'use-x-chat': [
      'packages/x/docs/x-sdk/use-x-chat.en-US.md',
      'packages/x/docs/x-sdk/use-x-conversations.en-US.md',
    ],
    'x-request': 'packages/x/docs/x-sdk/x-request.en-US.md',
    'x-markdown': 'packages/x/docs/x-markdown/examples.en-US.md',
    'x-components': [
      'packages/x/components/bubble/index.en-US.md',
      'packages/x/components/sender/index.en-US.md',
      'packages/x/components/conversations/index.en-US.md',
      'packages/x/components/welcome/index.en-US.md',
      'packages/x/components/prompts/index.en-US.md',
      'packages/x/components/attachments/index.en-US.md',
      'packages/x/components/suggestion/index.en-US.md',
      'packages/x/components/think/index.en-US.md',
      'packages/x/components/thought-chain/index.en-US.md',
      'packages/x/components/actions/index.en-US.md',
      'packages/x/components/file-card/index.en-US.md',
      'packages/x/components/sources/index.en-US.md',
      'packages/x/components/code-highlighter/index.en-US.md',
      'packages/x/components/mermaid/index.en-US.md',
      'packages/x/components/x-provider/index.en-US.md',
      'packages/x/components/notification/index.en-US.md',
      'packages/x/components/folder/index.en-US.md',
    ],
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
