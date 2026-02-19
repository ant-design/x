#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const skillsDir = path.join(__dirname, '..', 'skills');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const currentVersion = packageJson.version;

console.log(`📦 Current package version: ${currentVersion}`);

// Get all skill directories
const skills = fs
  .readdirSync(skillsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

console.log(`🔍 Found ${skills.length} skills to update:`);

// Update each skill's SKILL.md file
let updatedCount = 0;
for (const skillName of skills) {
  const skillMdPath = path.join(skillsDir, skillName, 'SKILL.md');

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
          content = content.replace(frontMatterRegex, (match, frontMatter) => {
            return `---\n${frontMatter}\n${newVersionLine}\n---`;
          });
        }
      }

      fs.writeFileSync(skillMdPath, content, 'utf-8');
      console.log(`✅ Updated ${skillName}/SKILL.md`);
      updatedCount++;
    } catch (error) {
      console.error(`❌ Failed to update ${skillName}/SKILL.md:`, error);
    }
  } else {
    console.log(`⚠️  ${skillName}/SKILL.md not found`);
  }
}

console.log(`\n🎉 Successfully updated ${updatedCount} skills with version ${currentVersion}`);
