import chalk from 'chalk';
import $ from 'dekko';

$('dist')
  .isDirectory()
  .hasFile('antdxcard.js')
  .hasFile('antdxcard.min.js')
  .hasFile('antdxcard.min.js.map');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `dist` directory is valid.'));
