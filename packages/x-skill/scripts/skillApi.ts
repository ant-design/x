#!/usr/bin/env node

import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import config, { type Config, type SkillConfig } from './config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Extract the component title from markdown frontmatter or first heading
 * @param filePath markdown file path
 * @returns component title string
 */
function extractComponentTitle(filePath: string, content: string): string {
  // Try frontmatter title field first
  const fmMatch = content.match(/^---\n[\s\S]*?^title:\s*(.+)$/m);
  if (fmMatch) return fmMatch[1].trim();
  // Fallback to filename
  return path
    .basename(filePath, '.md')
    .replace(/index\.(en-US|zh-CN)/, '')
    .replace(/[-_]/g, ' ')
    .trim();
}

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

    let apiStartIndex = apiIndex + 1;

    // 跳过开头的空行
    while (apiStartIndex < lines.length && lines[apiStartIndex].trim() === '') {
      apiStartIndex++;
    }

    // Stop at ## Semantic DOM or ## Design Token sections to keep output concise
    const stopSections = ['## Semantic DOM', '## Design Token', '## Theme Variables'];
    const endIndex = lines.findIndex(
      (line, i) => i > apiIndex && stopSections.some((s) => line.trim().startsWith(s)),
    );

    const apiLines =
      endIndex > 0 ? lines.slice(apiStartIndex, endIndex) : lines.slice(apiStartIndex);
    return apiLines.join('\n').trimEnd();
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return '';
  }
}

/**
 * Merge API content from multiple source files into one document.
 * Each source gets a ## <ComponentTitle> heading.
 * @param sourcePaths array of relative source paths
 * @param rootDir monorepo root directory
 * @returns merged API markdown content
 */
function mergeApiContent(sourcePaths: string[], rootDir: string): string {
  const sections: string[] = [];

  for (const sourcePath of sourcePaths) {
    const fullPath = path.join(rootDir, sourcePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`    File not found, skipping: ${fullPath}`);
      continue;
    }

    const rawContent = fs.readFileSync(fullPath, 'utf-8');
    const title = extractComponentTitle(fullPath, rawContent);
    const apiContent = extractApiContent(fullPath);

    if (!apiContent) {
      console.warn(`    No ## API section in: ${sourcePath}`);
      continue;
    }

    sections.push(`## ${title}\n\n${apiContent}`);
  }

  return sections.join('\n\n---\n\n');
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
  const rootDir = path.join(__dirname, '..', '..', '..');

  for (const [skillName, sourcePath] of Object.entries(skills)) {
    console.log(`  Processing skill: ${skillName}`);

    let apiContent: string;

    if (Array.isArray(sourcePath)) {
      // Multiple source files — merge their API sections
      apiContent = mergeApiContent(sourcePath, rootDir);
    } else {
      const fullSourcePath = path.join(rootDir, sourcePath);
      apiContent = extractApiContent(fullSourcePath);
    }

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
if (import.meta.url === `file://${__filename}`) {
  main();
}

export default {
  extractApiContent,
  processLanguage,
  main,
};
