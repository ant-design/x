#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const skillsZhDir = path.join(__dirname, '..', 'skills-zh');
const skillsEnDir = path.join(__dirname, '..', 'skills');
const marketplaceJsonPath = path.join(__dirname, '..', '.claude-plugin', 'marketplace.json');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const currentVersion = packageJson.version;

console.log(`📦 Current package version: ${currentVersion}`);

const skillsZh = fs
  .readdirSync(skillsZhDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const skillsEn = fs
  .readdirSync(skillsEnDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

console.log(
  `🔍 Found ${skillsZh.length} Chinese skills and ${skillsEn.length} English skills to update:`,
);

// Update each skill's SKILL.md files for both languages
let updatedCount = 0;

// Update Chinese skills
for (const skillName of skillsZh) {
  const skillMdPath = path.join(skillsZhDir, skillName, 'SKILL.md');

  if (fs.existsSync(skillMdPath)) {
    try {
      let content = fs.readFileSync(skillMdPath, 'utf-8');

      // Use regex to replace version field
      const versionRegex = /^version:\s*.*$/m;
      const newVersionLine = `version: ${currentVersion}`;

      if (versionRegex.test(content)) {
        content = content.replace(versionRegex, newVersionLine);
      } else {
        // If no version field exists, add it to front matter
        const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
        if (frontMatterRegex.test(content)) {
          content = content.replace(frontMatterRegex, (_match, frontMatter) => {
            return `---\n${frontMatter}\n${newVersionLine}\n---`;
          });
        }
      }

      fs.writeFileSync(skillMdPath, content, 'utf-8');
      console.log(`✅ Updated skills-zh/${skillName}/SKILL.md`);
      updatedCount++;
    } catch (error) {
      console.error(`❌ Failed to update skills-zh/${skillName}/SKILL.md:`, error);
    }
  } else {
    console.log(`⚠️  skills-zh/${skillName}/SKILL.md not found`);
  }
}

// Update English skills
for (const skillName of skillsEn) {
  const skillMdPath = path.join(skillsEnDir, skillName, 'SKILL.md');

  if (fs.existsSync(skillMdPath)) {
    try {
      let content = fs.readFileSync(skillMdPath, 'utf-8');

      // Use regex to replace version field
      const versionRegex = /^version:\s*.*$/m;
      const newVersionLine = `version: ${currentVersion}`;

      if (versionRegex.test(content)) {
        content = content.replace(versionRegex, newVersionLine);
      } else {
        // If no version field exists, add it to front matter
        const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
        if (frontMatterRegex.test(content)) {
          content = content.replace(frontMatterRegex, (_match, frontMatter) => {
            return `---\n${frontMatter}\n${newVersionLine}\n---`;
          });
        }
      }

      fs.writeFileSync(skillMdPath, content, 'utf-8');
      console.log(`✅ Updated skills/${skillName}/SKILL.md`);
      updatedCount++;
    } catch (error) {
      console.error(`❌ Failed to update skills/${skillName}/SKILL.md:`, error);
    }
  } else {
    console.log(`⚠️  skills/${skillName}/SKILL.md not found`);
  }
}

// Update marketplace.json version
console.log(`\n🔄 Updating marketplace.json version...`);
try {
  if (fs.existsSync(marketplaceJsonPath)) {
    const marketplaceJson = JSON.parse(fs.readFileSync(marketplaceJsonPath, 'utf-8'));
    marketplaceJson.metadata.version = currentVersion;
    fs.writeFileSync(marketplaceJsonPath, JSON.stringify(marketplaceJson, null, 2) + '\n', 'utf-8');
    console.log(`✅ Updated marketplace.json version to ${currentVersion}`);
  } else {
    console.log(`⚠️  marketplace.json not found at ${marketplaceJsonPath}`);
  }
} catch (error) {
  console.error(`❌ Failed to update marketplace.json:`, error);
}

console.log(
  `\n🎉 Successfully updated ${updatedCount} skills and marketplace.json with version ${currentVersion}`,
);
