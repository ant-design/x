#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import config, { Config, SkillConfig } from './config';

/**
 * Extract content after ## API from markdown file
 * @param filePath markdown file path
 * @returns API section content
 */
function extractApiContent(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // 查找## API的位置
    const apiIndex = lines.findIndex((line) => line.trim() === '## API');

    if (apiIndex === -1) {
      console.warn(`## API section not found in file ${filePath}`);
      return '';
    }

    const apiStartIndex = apiIndex + 1;

    // 提取API后的所有内容
    const apiContent = lines.slice(apiStartIndex).join('\n');
    return apiContent.trim();
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return '';
  }
}

/**
 * Ensure directory exists
 * @param dirPath directory path
 */
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Process API documentation for a single language
 * @param lang language code
 * @param skills skill configuration
 */
function processLanguage(lang: string, skills: SkillConfig): void {
  console.log(`Processing ${lang} language...`);

  // 根据语言确定目标目录
  const baseTargetDir = lang === 'zh' ? config.paths.skillsZhDir : config.paths.skillsEnDir;

  for (const [skillName, sourcePath] of Object.entries(skills)) {
    console.log(`  Processing skill: ${skillName}`);

    const fullSourcePath = path.join(__dirname, '..', '..', '..', sourcePath);
    const apiContent = extractApiContent(fullSourcePath);
    if (!apiContent) {
      console.warn(`    Skipping ${skillName}: API content not found`);
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
      console.log(`    Updated: ${targetFile}`);
    } catch (error) {
      console.error(`    Error writing file ${targetFile}:`, error);
    }
  }
}

/**
 * Main function
 */
function main(): void {
  console.log('Starting skill API documentation update...\n');

  const typedConfig = config as Config;

  // Process Chinese
  processLanguage('zh', typedConfig.zh);
  console.log();

  // Process English
  processLanguage('en', typedConfig.en);

  console.log('\nAPI documentation update completed!');
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
