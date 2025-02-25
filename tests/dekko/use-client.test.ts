import fs from 'node:fs';
import chalk from 'chalk';
import $ from 'dekko';

const includeUseClient = (filename: string) =>
  fs.readFileSync(filename).toString().includes('"use client"');

if (process.env.LIB_DIR === 'dist') {
  $('dist/*')
    .isFile()
    .assert("doesn't contain use client", (filename: string) => !includeUseClient(filename));
} else {
  $('{es,lib}/index.js')
    .isFile()
    .assert('contain use client', (filename: string) => includeUseClient(filename));

  $('{es,lib}/*/index.js')
    .isFile()
    .assert('contain use client', (filename: string) => includeUseClient(filename));

  // check tsx files
  $('{es,lib}/typography/*.js')
    .isFile()
    .assert('contain use client', (filename: string) => includeUseClient(filename));

  $('{es,lib}/typography/Base/*.js')
    .isFile()
    .filter((filename: string) => !filename.endsWith('/util.js'))
    .assert('contain use client', (filename: string) => includeUseClient(filename));
}

// eslint-disable-next-line no-console
console.log(chalk.green('✨ use client passed!'));
