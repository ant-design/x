import fs from 'fs-extra';
import path from 'path';

const copyConfig = () => {
  try {
    fs.copySync(
      path.join(__dirname, '..', '..', '/x-markdown/src/plugins/theme/interface/', 'components.ts'),
      path.join(__dirname, '..', 'components/theme/interface', 'XMarkdownComponents.ts'),
    );
    fs.copySync(
      path.join(__dirname, '..', '..', '/x-markdown/src/plugins', 'type.ts'),
      path.join(__dirname, '..', 'components/x-provider', 'XMarkdownComponents.ts'),
    );
  } catch (err) {
    console.error(err);
  }
};

copyConfig();
