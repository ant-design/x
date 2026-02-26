#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import config from './config';

interface SkillConfig {
  [skillName: string]: string;
}

interface Config {
  zh: SkillConfig;
  en: SkillConfig;
}

/**
 * 从markdown文件中提取## API后的内容
 * @param filePath markdown文件路径
 * @returns API部分内容
 */
function extractApiContent(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    let apiStartIndex = -1;

    // 查找## API的位置
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '## API') {
        apiStartIndex = i + 1;
        break;
      }
    }

    if (apiStartIndex === -1) {
      console.warn(`在文件 ${filePath} 中未找到 ## API 部分`);
      return '';
    }

    // 提取API后的所有内容
    const apiContent = lines.slice(apiStartIndex).join('\n');
    return apiContent.trim();
  } catch (error) {
    console.error(`读取文件 ${filePath} 时出错:`, error);
    return '';
  }
}

/**
 * 确保目录存在
 * @param dirPath 目录路径
 */
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 处理单个语言的API文档
 * @param lang 语言代码
 * @param skills 技能配置
 */
function processLanguage(lang: string, skills: SkillConfig): void {
  console.log(`处理 ${lang} 语言...`);

  // 根据语言确定目标目录
  const baseTargetDir = lang === 'zh' ? config.paths.skillsZhDir : config.paths.skillsEnDir;

  for (const [skillName, sourcePath] of Object.entries(skills)) {
    console.log(`  处理技能: ${skillName}`);

    const fullSourcePath = path.join(__dirname, '..', '..', '..', sourcePath);
    const apiContent = extractApiContent(fullSourcePath);
    if (!apiContent) {
      console.warn(`    跳过 ${skillName}: 未找到API内容`);
      continue;
    }

    // 构建目标路径
    const targetDir = path.join(baseTargetDir, skillName, 'reference');
    const targetFile = path.join(targetDir, 'API.md');

    // 确保目录存在
    ensureDirectoryExists(targetDir);

    // 写入API文档
    try {
      fs.writeFileSync(targetFile, apiContent);
      console.log(`    已更新: ${targetFile}`);
    } catch (error) {
      console.error(`    写入文件 ${targetFile} 时出错:`, error);
    }
  }
}

/**
 * 主函数
 */
function main(): void {
  console.log('开始更新技能API文档...\n');

  const typedConfig = config as Config;

  // 处理中文
  processLanguage('zh', typedConfig.zh);
  console.log();

  // 处理英文
  processLanguage('en', typedConfig.en);

  console.log('\nAPI文档更新完成！');
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

export default {
  extractApiContent,
  processLanguage,
  main,
};
