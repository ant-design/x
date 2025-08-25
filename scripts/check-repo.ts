/* eslint-disable no-console */
import chalk from 'chalk';
import fetch from 'isomorphic-fetch';
import ora from 'ora';
import type { StatusResult } from 'simple-git';
import simpleGit from 'simple-git';

import { version } from '../package.json';

const cwd = process.cwd();
const git = simpleGit(cwd);
const spinner = ora('Loading unicorns').start('开始检查仓库状态');

function exitProcess(code = 1) {
  console.log(''); // Keep an empty line here to make looks good~
  process.exit(code);
}

async function checkVersion() {
  spinner.start('正在检查当前版本是否已经存在');

  type RaceUrlKey = 'x' | 'x-sdk' | 'x-markdown';
  const raceUrlObj: Record<RaceUrlKey, string[]> = {
    x: ['http://registry.npmjs.org/@ant-design/x', 'https://registry.npmmirror.com/@ant-design/x'],
    'x-sdk': [
      'http://registry.npmjs.org/@ant-design/x-sdk',
      'https://registry.npmmirror.com/@ant-design/x-sdk',
    ],
    'x-markdown': [
      'http://registry.npmjs.org/@ant-design/x-markdown',
      'https://registry.npmmirror.com/@ant-design/x-markdown',
    ],
  };

  const argKey = process.argv.slice(2)[0] as RaceUrlKey;
  const raceUrl: string[] = argKey
    ? raceUrlObj[argKey]
    : Object.keys(raceUrlObj).reduce((raceUrls: string[], key) => {
        raceUrls.push(...(raceUrlObj?.[key as RaceUrlKey] || []));
        return raceUrls;
      }, []);

  // any of the urls return the data will be fine
  const promises = raceUrl.map((url) =>
    fetch(url)
      .then((res) => res.json())
      // Ignore the error
      .catch(() => new Promise(() => {})),
  );
  const { versions } = await Promise.race(promises);

  if (version in versions) {
    spinner.fail(
      chalk.yellow(
        `😈${argKey ? versions[version].name : ''} Current version already exists. Forget update package.json?`,
      ),
    );
    spinner.info(`${chalk.cyan(' => Current:')}: ${version}`);
    spinner.info(
      `${chalk.cyan(' => Todo:')}: update the x-mono package.json version and execute the command ${chalk.yellow('npm run publish-version')}`,
    );
    exitProcess();
  }
  spinner.succeed('版本检查通过');
}

async function checkBranch({ current }: StatusResult) {
  spinner.start('正在检查当前分支是否合法');
  if (
    version.includes('-alpha.') ||
    version.includes('-beta.') ||
    version.includes('-rc.') ||
    version.includes('-experimental.')
  ) {
    spinner.info(chalk.cyan('😃 Alpha version. Skip branch check.'));
  } else if (current !== 'main') {
    spinner.fail(chalk.red('🤔 You are not in the main branch!'));
    exitProcess();
  }
  spinner.succeed('分支检查通过');
}

async function checkCommit({ files }: StatusResult) {
  spinner.start('正在检查当前 git 状态');
  if (files.length) {
    spinner.fail(chalk.red('🙄 You forgot something to commit.'));
    files.forEach(({ path: filePath, working_dir: mark }) => {
      console.log(' -', chalk.red(mark), filePath);
    });
    exitProcess();
  }
  spinner.succeed('git 状态检查通过');
}

async function checkRemote() {
  spinner.start('正在检查远程分支');
  const { remote } = await git.fetch('origin', 'main');
  if (!remote?.includes('ant-design/x')) {
    const { value } = await git.getConfig('remote.origin.url');
    if (!value?.includes('ant-design/x')) {
      spinner.fail(chalk.red('🧐 Your remote origin is not ant-design/x, did you fork it?'));
      exitProcess();
    }
  }
  spinner.succeed('远程分支检查通过');
}

export default async function checkRepo() {
  const status = await git.status();
  await checkVersion();
  await checkBranch(status);
  await checkCommit(status);
  await checkRemote();
}
