import chalk from 'chalk';
import $ from 'dekko';

$('dist').isDirectory().hasFile('x-card.js').hasFile('x-card.min.js').hasFile('x-card.min.js.map');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `dist` directory is valid.'));
