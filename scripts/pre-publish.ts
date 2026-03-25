/* eslint-disable camelcase, no-async-promise-executor */
import runScript from '@npmcli/run-script';
import chalk from 'chalk';
import fetch from 'isomorphic-fetch';
import Spinnies from 'spinnies';
import checkRepo from './check-repo';

const { Notification: Notifier } = require('node-notifier');
const simpleGit = require('simple-git');

const spinner = { interval: 80, frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'] };
const spinnies = new Spinnies({ spinner });

let spinniesId = 0;

// `spinnies` 为按条目进度，需要做简单的封装变成接近 `ora` 的形态
const showMessage = (
  message: string,
  status?: 'succeed' | 'fail' | 'spinning' | 'non-spinnable' | 'stopped' | true,
  uniqueTitle?: string,
) => {
  if (!status) {
    spinnies.add(`info-${spinniesId}`, {
      text: message,
      status: 'non-spinnable',
    });
    spinniesId += 1;
  } else {
    const mergedId = uniqueTitle || `msg-${spinniesId}`;
    let mergedMessage = uniqueTitle ? `${uniqueTitle} ${message}` : message;

    // `spinnies` 对中文支持有 bug，长度会按中文一半计算。我们翻个倍修复一下。
    mergedMessage = `${mergedMessage}${' '.repeat(mergedMessage.length)}`;

    const existSpinner = spinnies.pick(mergedId);
    if (!existSpinner) {
      spinnies.add(mergedId, {
        text: '',
      });
    }

    if (status === 'succeed' || status === 'fail' || status === 'stopped') {
      spinnies.update(mergedId, {
        text: mergedMessage,
        status,
      });
      spinniesId += 1;
    } else {
      spinnies.update(mergedId, {
        text: mergedMessage,
        status: status === true ? 'spinning' : status,
      });
    }
  }
};

process.on('SIGINT', () => {
  process.exit(1);
});

// 检查包是否已存在于 npm
async function checkPackageExistsOnNpm(packageName: string): Promise<boolean> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${packageName}`);
    if (res.ok) {
      const data = await res.json();
      // npm registry 返回 {"error":"Not found"} 时，res.ok 仍为 true
      // 需要检查是否有 versions 字段
      return !!data?.versions && Object.keys(data.versions).length > 0;
    }
    return false;
  } catch {
    return false;
  }
}

const runPrePublish = async () => {
  await checkRepo();

  const git = simpleGit();
  const { current: currentBranch } = await git.branch();

  // 本地-远程分支同步
  showMessage(`正在拉取远程分支 ${currentBranch}`, true);
  await git.pull('origin', currentBranch);
  showMessage(`成功拉取远程分支 ${currentBranch}`, 'succeed');
  showMessage(`正在推送本地分支 ${currentBranch}`, true);
  await git.push('origin', currentBranch);
  showMessage(`成功推送远程分支 ${currentBranch}`, 'succeed');
  showMessage(`已经和远程分支保持同步 ${currentBranch}`, 'succeed');

  const { latest } = await git.log();
  const sha = process.env.TARGET_SHA || latest.hash;

  // 最后一次 commit 信息
  showMessage(`找到本地最新 commit:`, 'succeed');
  showMessage(chalk.cyan(`  hash: ${sha}`));
  showMessage(chalk.cyan(`  date: ${latest.date}`));
  showMessage(chalk.cyan(`  message: ${latest.message}`));
  showMessage(chalk.cyan(`  author_name: ${latest.author_name}`));

  // clean up
  await runScript({ event: 'clean', path: '.', stdio: 'inherit' });
  showMessage(`成功清理构建产物目录`, 'succeed');

  // CI

  // const workspacePath = `${path.join(__dirname, process.argv.slice(2)?.[0])}` || '.';

  showMessage(`[CI] 正在执行 lint`, true);
  await runScript({ event: 'lint', path: '.', stdio: 'inherit' });
  showMessage(`[CI] lint 执行成功`, 'succeed');
  showMessage(`[CI] 正在执行 compile`, true);
  await runScript({ event: 'compile', path: '.', stdio: 'inherit' });
  showMessage(`[CI] compile 执行成功`, 'succeed');
  showMessage(`[CI] 正在执行 test`, true);
  await runScript({ event: 'test', path: '.', stdio: 'inherit' });
  showMessage(`[CI] test 执行成功`, 'succeed');

  await runScript({ event: 'test:dekko', path: '.', stdio: 'inherit' });

  // 获取当前包名并检查是否已存在于 npm
  const argKey = process.argv.slice(2)[0];
  if (argKey) {
    const packageName = `@ant-design/${argKey}`;
    const packageExists = await checkPackageExistsOnNpm(packageName);

    if (packageExists) {
      showMessage(`[CI] 正在执行 package-diff`, true);
      await runScript({ event: 'test:package-diff', path: '.', stdio: 'inherit' });
      showMessage(`[CI] package-diff 执行成功`, 'succeed');
    } else {
      showMessage(
        chalk.cyan(`😃 Package ${packageName} not found in npm registry. Skip package-diff check.`),
        'succeed',
      );
    }
  } else {
    // 如果没有指定包名，仍然执行 package-diff（兼容旧行为）
    await runScript({ event: 'test:package-diff', path: '.', stdio: 'inherit' });
  }

  showMessage(`文件检查通过，准备发布！`, 'succeed');

  new Notifier().notify({
    title: '✅ 准备发布到 npm',
    message: '产物已经准备好了，快回来输入 npm 校验码了！',
    sound: 'Crystal',
  });
  process.exit(0);
};

runPrePublish();
