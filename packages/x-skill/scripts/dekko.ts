#!/usr/bin/env node

/**
 * dekko.ts - Use dekko tool to check X-Skill project structure
 *
 * Use dekko assertion library to validate:
 * 1. bin/index.js file exists and is executable
 * 2. Each skill has a SKILL.md file
 * 3. Skill directory structure meets specifications
 */

import chalk from 'chalk';
import $ from 'dekko';
import * as fs from 'fs';
import * as path from 'path';
import config from './config';

// Get project root directory
const rootPath = config.paths.rootDir;

// Check bin directory
$(config.paths.binDir).isDirectory().hasFile('index.js');

// Check if bin/index.js is executable
const binIndexPath = path.join(config.paths.binDir, 'index.js');
try {
  const stats = fs.statSync(binIndexPath);
  const isExecutable = (stats.mode & 0o111) !== 0;
  if (!isExecutable) {
    throw new Error('bin/index.js is not executable');
  }
} catch (error) {
  console.error(chalk.red(`❌ bin/index.js check failed: ${error}`));
  process.exit(1);
}

// Check skills directories
$(config.paths.skillsEnDir).isDirectory();
$(config.paths.skillsZhDir).isDirectory();

// Get all skill directories for English skills
const skillsEnPath = config.paths.skillsEnDir;
const skillsZhPath = config.paths.skillsZhDir;

const skillsEn = fs
  .readdirSync(skillsEnPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .filter((name) => !name.startsWith('.'));

const skillsZh = fs
  .readdirSync(skillsZhPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .filter((name) => !name.startsWith('.'));

// Check English skills structure
skillsEn.forEach((skillName) => {
  const skillPath = path.join(rootPath, 'skills', skillName);

  // Check skill directory structure
  $(skillPath).isDirectory().hasFile('SKILL.md');
  $(path.join(skillPath, 'reference')).isDirectory();
});

// Check Chinese skills structure
skillsZh.forEach((skillName) => {
  const skillPath = path.join(rootPath, 'skills-zh', skillName);

  // Check skill directory structure
  $(skillPath).isDirectory().hasFile('SKILL.md');
  $(path.join(skillPath, 'reference')).isDirectory();
});

// Output success message
const totalSkills = skillsEn.length + skillsZh.length;
console.log(chalk.green('✨ X-Skill project structure check passed!'));
console.log(chalk.blue(`📁 Found ${totalSkills} skills:`));
console.log(chalk.blue(`   📁 ${skillsEn.length} English skills in /skills/`));
console.log(chalk.blue(`   📁 ${skillsZh.length} Chinese skills in /skills-zh/`));

[...skillsEn, ...skillsZh].forEach((name) => {
  console.log(chalk.blue(`   ✓ ${name}`));
});
