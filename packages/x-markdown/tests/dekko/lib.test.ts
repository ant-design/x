import chalk from 'chalk';
import $ from 'dekko';

$('lib').isDirectory().hasFile('index.js').hasFile('index.d.ts');

// without plugins
$('lib/*')
  .filter(
    (filename: string) =>
      !filename.endsWith('hooks') &&
      !filename.endsWith('index.js') &&
      !filename.endsWith('index.d.ts') &&
      !filename.endsWith('.map'),
  )
  .isDirectory()
  .filter(
    (filename: string) =>
      !filename.endsWith('plugins') &&
      !filename.endsWith('hooks') &&
      !filename.endsWith('style') &&
      !filename.endsWith('_util') &&
      !filename.endsWith('locale') &&
      !filename.endsWith('themes') &&
      !filename.endsWith('theme'),
  )
  .hasFile('index.js')
  .hasFile('index.d.ts');

// plugins

$('lib/plugins').isDirectory().hasFile('type.js').hasFile('type.d.ts');

$('lib/plugins/*')
  .filter(
    (filename: string) =>
      !filename.endsWith('type.js') &&
      !filename.endsWith('type.d.ts') &&
      !filename.endsWith('hooks') &&
      !filename.endsWith('theme'),
  )
  .isDirectory()
  .hasFile('index.js')
  .hasFile('index.d.ts');

// hooks
$('lib/plugins/hooks').isDirectory();

// theme
$('lib/plugins/theme').isDirectory();

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `lib/plugins` directory is valid.'));

// themes
$('lib/themes').isDirectory().hasFile('light.css');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `lib/themes` directory is valid.'));
