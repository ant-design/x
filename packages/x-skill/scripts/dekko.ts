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

// Get project root directory
const rootPath = path.join(__dirname, '..');

// Check bin directory
$(path.join(rootPath, 'bin')).isDirectory().hasFile('index.js');

// Check if bin/index.js is executable
const binIndexPath = path.join(rootPath, 'bin', 'index.js');
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

// Check skills directory
$(path.join(rootPath, 'skills')).isDirectory();

// Get all skill directories
const skillsPath = path.join(rootPath, 'skills');
const skillDirs = fs
  .readdirSync(skillsPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .filter((name) => !name.startsWith('.'));

// Check each skill directory for bilingual structure
skillDirs.forEach((skillName) => {
  const skillPath = path.join(rootPath, 'skills', skillName);

  // Check bilingual structure: zh/ and en/ directories
  $(skillPath).isDirectory().hasDirectory('zh').hasDirectory('en');

  // Check SKILL.md files in both languages
  $(path.join(skillPath, 'zh')).isDirectory().hasFile('SKILL.md');
  $(path.join(skillPath, 'en')).isDirectory().hasFile('SKILL.md');

  // Check reference directories in both languages
  $(path.join(skillPath, 'zh', 'reference')).isDirectory();
  $(path.join(skillPath, 'en', 'reference')).isDirectory();
});

// Output success message
console.log(chalk.green('✨ X-Skill project structure check passed!'));
console.log(chalk.blue(`📁 Found ${skillDirs.length} skills:`));
skillDirs.forEach((name) => {
  console.log(chalk.blue(`   ✓ ${name}`));
});
