import path from 'path';
import fs from 'fs-extra';

import { version } from '../package.json';

fs.writeFileSync(
  path.join(__dirname, '..', 'components', 'version', 'version.ts'),
  `export default '${version}';`,
  'utf8',
);
