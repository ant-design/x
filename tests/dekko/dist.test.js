const $ = require('dekko');
const chalk = require('chalk');

$('dist').isDirectory().hasFile('antdx.js').hasFile('antdx.min.js').hasFile('antdx.min.js.map');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `dist` directory is valid.'));
