const $ = require('dekko');
const chalk = require('chalk');

$('dist')
  .isDirectory()
  // .hasFile('antd-x-with-locales.js')
  // .hasFile('antd-x-with-locales.js.map')
  // .hasFile('antd-x-with-locales.min.js')
  // .hasFile('antd-x-with-locales.min.js.map')
  .hasFile('antdx.js')
  .hasFile('antdx.min.js')
  .hasFile('antdx.min.js.map');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `dist` directory is valid.'));
