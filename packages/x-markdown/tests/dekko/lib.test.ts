import chalk from 'chalk';
import $ from 'dekko';

$('lib').isDirectory().hasFile('index.js').hasFile('index.d.ts');
// without plugins
$('lib/*')
  .filter(
    (filename: string) =>
      !filename.endsWith('plugins') &&
      !filename.endsWith('index.js') &&
      !filename.endsWith('index.d.ts') &&
      !filename.endsWith('.map'),
  )
  .isDirectory()
  .filter(
    (filename: string) =>
      !filename.endsWith('style') &&
      !filename.endsWith('_util') &&
      !filename.endsWith('locale') &&
      !filename.endsWith('theme'),
  )
  .hasFile('index.js')
  .hasFile('index.d.ts');

// plugins

$('lib/plugins').isDirectory().hasFile('type.js').hasFile('type.d.ts');

$('lib/plugins/*')
  .filter((filename: string) => !filename.endsWith('type.js') && !filename.endsWith('type.d.ts'))
  .isDirectory()
  .hasFile('index.js')
  .hasFile('index.d.ts');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `lib` directory is valid.'));

// themes
$('lib/theme').isDirectory().hasFile('index.js').hasFile('index.d.ts');

$('lib/theme/*')
  .filter((filename: string) => !filename.endsWith('index.js') && !filename.endsWith('index.d.ts'))
  .isDirectory()
  .hasFile('index.js')
  .hasFile('index.d.ts');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `theme` directory is valid.'));
