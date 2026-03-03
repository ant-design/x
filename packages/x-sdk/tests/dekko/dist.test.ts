import chalk from 'chalk';
import $ from 'dekko';

$('dist').isDirectory().hasFile('x-sdk.js').hasFile('x-sdk.min.js').hasFile('x-sdk.min.js.map');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `dist` directory is valid.'));
