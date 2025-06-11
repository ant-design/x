import chalk from 'chalk';
import $ from 'dekko';

$('dist')
  .isDirectory()
  .hasFile('antdxsdk.js')
  .hasFile('antdxsdk.min.js')
  .hasFile('antdxsdk.min.js.map');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `dist` directory is valid.'));
