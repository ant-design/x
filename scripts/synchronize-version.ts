import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';

function exitProcess(code = 1) {
  process.exit(code);
}
const spinner = ora('Loading unicorns').start('开始同步版本');
export default async function synchronizeVersion() {
  spinner.start('正在同步发布版本');
  const baseDir = path.join(process.cwd(), './packages');
  const { version: publishVersion } = await fs.readJSON(path.join(process.cwd(), './package.json'));
  if (publishVersion) {
    const dirs = fs.readdirSync(baseDir);
    for (const dir of dirs) {
      const result = path.join(baseDir, dir);
      const stat = await fs.stat(result);

      if (stat.isDirectory()) {
        const subPath = `${baseDir}/${dir}/package.json`;

        const package_json = await fs.readJson(subPath);
        console.log(package_json.version, 111)
        package_json.version = publishVersion;

        fs.writeJsonSync(subPath, package_json, { spaces: 2,encoding:'utf-8' });

        spinner.succeed(`${dir} 同步版本成功!`);

      }
    }
  } else {
    spinner.fail(chalk.red('🤔 同步发布版本失败!'));
     exitProcess()
  }
 
}

synchronizeVersion();