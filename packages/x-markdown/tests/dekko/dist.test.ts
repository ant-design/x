import chalk from 'chalk';
import $ from 'dekko';

$('dist')
  .isDirectory()
  .hasFile('x-markdown.js')
  .hasFile('x-markdown.min.js')
  .hasFile('x-markdown.min.js.map')
  .hasFile('latex.js')
  .hasFile('latex.min.js')
  .hasFile('latex.min.js.map')
  .hasFile('code-high-light.js')
  .hasFile('code-high-light.min.js')
  .hasFile('code-high-light.min.js.map');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `dist` directory is valid.'));
