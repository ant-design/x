import chalk from 'chalk';
import $ from 'dekko';

$('dist')
  .isDirectory()
  .hasFile('antdxmarkdown.js')
  .hasFile('antdxmarkdown.min.js')
  .hasFile('antdxmarkdown.min.js.map');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `dist` directory is valid.'));
