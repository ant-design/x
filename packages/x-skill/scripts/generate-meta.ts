#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

/**
 * 自动生成skill元数据配置文件的脚本
 * 从skill目录下的SKILL.md文件和marketplace.json中提取信息
 */

interface SkillMetadata {
  skill: string;
  name: string;
  version: string;
  desc: string;
  descZh: string;
  tags: string[];
}

interface MarketplaceConfig {
  plugins: Array<{
    name: string;
    description: string;
    descriptionZh: string;
    skills: string[];
  }>;
}

const SKILL_ROOT_EN = path.join(__dirname, '../skills');
const SKILL_ROOT_ZH = path.join(__dirname, '../skills-zh');
const OUTPUT_PATH = path.join(__dirname, '../src/skill-meta.json');
const MARKETPLACE_PATH = path.join(__dirname, '../.claude-plugin/marketplace.json');

/**
 * 从marketplace.json读取插件配置
 */
function readMarketplaceConfig(): MarketplaceConfig {
  if (!fs.existsSync(MARKETPLACE_PATH)) {
    console.warn('marketplace.json not found');
    return { plugins: [] };
  }

  const content = fs.readFileSync(MARKETPLACE_PATH, 'utf8');
  return JSON.parse(content);
}

/**
 * 从SKILL.md文件中提取元数据
 */
function extractSkillMetadata(skillName: string): SkillMetadata | null {
  const skillFileEn = path.join(SKILL_ROOT_EN, skillName, 'SKILL.md');
  const skillFileZh = path.join(SKILL_ROOT_ZH, skillName, 'SKILL.md');

  // 从package.json读取版本号
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const packageVersion = packageJson.version;

  let descEn = '';
  let descZh = '';
  let version = packageVersion;
  let name = skillName;

  // 读取英文描述
  if (fs.existsSync(skillFileEn)) {
    const contentEn = fs.readFileSync(skillFileEn, 'utf8');
    const frontMatterMatchEn = contentEn.match(/^---\n([\s\S]*?)\n---/);

    if (frontMatterMatchEn) {
      const frontMatter = frontMatterMatchEn[1];
      const lines = frontMatter.split('\n');

      lines.forEach((line) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          if (key === 'description') {
            descEn = value;
          } else if (key === 'name') {
            name = value;
          } else if (key === 'version') {
            version = value;
          }
        }
      });
    }
  }

  // 读取中文描述
  if (fs.existsSync(skillFileZh)) {
    const contentZh = fs.readFileSync(skillFileZh, 'utf8');
    const frontMatterMatchZh = contentZh.match(/^---\n([\s\S]*?)\n---/);

    if (frontMatterMatchZh) {
      const frontMatter = frontMatterMatchZh[1];
      const lines = frontMatter.split('\n');

      lines.forEach((line) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          if (key === 'description') {
            descZh = value;
          }
        }
      });
    }
  }

  // 如果中文描述不存在，使用英文描述
  if (!descZh && descEn) {
    descZh = descEn;
  }

  // 如果英文描述不存在，使用中文描述
  if (!descEn && descZh) {
    descEn = descZh;
  }

  // 从skill名称和marketplace.json推断标签
  const tags = extractTags(skillName);

  return {
    skill: skillName,
    name: name || skillName,
    version: version || packageVersion,
    desc: descEn,
    descZh: descZh || descEn,
    tags,
  };
}

/**
 * 从skill名称提取标签
 */
function extractTags(skillName: string): string[] {
  const tags: string[] = [];

  // 基于skill名称的关键词提取
  if (skillName.includes('chat')) tags.push('chat');
  if (skillName.includes('provider')) tags.push('provider');
  if (skillName.includes('request')) tags.push('request');
  if (skillName.includes('use-')) tags.push('hook');
  if (skillName.includes('x-')) tags.push('sdk');

  return tags.length > 0 ? tags : [skillName];
}

/**
 * 获取skill对应的插件信息
 */
function getPluginInfo(skillName: string): { category: string; desc: string; descZh: string } {
  const config = readMarketplaceConfig();

  if (config.plugins && config.plugins.length > 0) {
    for (const plugin of config.plugins) {
      if (plugin.skills && Array.isArray(plugin.skills)) {
        // 检查skill是否在插件的skills列表中
        const skillPaths = plugin.skills.map((skill) =>
          skill.replace('./skills/', '').replace(/\/$/, ''),
        );
        if (skillPaths.includes(skillName)) {
          return {
            category: plugin.name || 'x-sdk-skills',
            desc: plugin.description || '',
            descZh: (plugin as any).descriptionZh || plugin.description || '',
          };
        }
      }
    }
  }
  return {
    category: 'x-sdk-skills',
    desc: 'Ant Design X SDK core skill package',
    descZh: 'Ant Design X SDK 核心技能包',
  };
}

/**
 * 扫描skill目录
 */
function scanSkills(): SkillMetadata[] {
  if (!fs.existsSync(SKILL_ROOT_EN)) {
    console.error(`Skill root directory not found: ${SKILL_ROOT_EN}`);
    return [];
  }

  const skills: SkillMetadata[] = [];
  const items = fs.readdirSync(SKILL_ROOT_EN);

  items.forEach((item) => {
    const skillPath = path.join(SKILL_ROOT_EN, item);
    const stat = fs.statSync(skillPath);

    if (stat.isDirectory()) {
      const metadata = extractSkillMetadata(item);
      if (metadata) {
        skills.push(metadata);
      }
    }
  });

  return skills;
}

/**
 * 生成配置文件
 */
function generateSkillMeta(): void {
  console.log('🔍 Scanning skills...');
  const skills = scanSkills();

  if (skills.length === 0) {
    console.warn('No skills found');
    return;
  }

  console.log(`✅ Found ${skills.length} skills`);

  // 确保输出目录存在
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 按分类组织skill，并添加分类描述
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      const pluginInfo = getPluginInfo(skill.skill);
      if (!acc[pluginInfo.category]) {
        acc[pluginInfo.category] = {
          description: pluginInfo.desc,
          descriptionZh: pluginInfo.descZh,
          skills: [],
        };
      }
      acc[pluginInfo.category].skills.push(skill);
      return acc;
    },
    {} as Record<
      string,
      {
        description: string;
        descriptionZh: string;
        skills: SkillMetadata[];
      }
    >,
  );

  // 写入配置文件
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(groupedSkills, null, 2));
  console.log(`📝 Generated skill meta file: ${OUTPUT_PATH}`);

  // 打印生成的skill列表
  console.log('\n📋 Generated skills:');
  Object.entries(groupedSkills).forEach(([category, group]) => {
    console.log(`  ${category}:`);
    group.skills.forEach((skill) => {
      console.log(`    - ${skill.name}`);
    });
  });
}

// 执行生成
if (require.main === module) {
  generateSkillMeta();
}

export { extractSkillMetadata, generateSkillMeta, scanSkills };
