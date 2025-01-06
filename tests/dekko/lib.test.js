import chalk from 'chalk';
import $ from 'dekko';

$('lib').isDirectory().hasFile('index.js').hasFile('index.d.ts');

$('lib/*')
  .filter(
    (filename) =>
      !filename.endsWith('index.js') &&
      !filename.endsWith('index.d.ts') &&
      !filename.endsWith('.map'),
  )
  .isDirectory()
  .filter(
    (filename) =>
      !filename.endsWith('style') &&
      !filename.endsWith('_util') &&
      !filename.endsWith('locale') &&
      !filename.endsWith('theme'),
  )
  .hasFile('index.js')
  .hasFile('index.d.ts');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `lib` directory is valid.'));
