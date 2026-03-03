import { FileCard } from '@ant-design/x';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    file: '文件',
    icon: '图标',
    name: '名称',
    description: '描述',
  },
  en: {
    root: 'Root',
    file: 'File',
    icon: 'Icon',
    name: 'Name',
    description: 'Description',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      componentName="FileCard"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'file', desc: locale.file },
        { name: 'icon', desc: locale.icon },
        { name: 'name', desc: locale.name },
        { name: 'description', desc: locale.description },
      ]}
    >
      <FileCard name="pdf-file.pdf" byte={1024} />
    </SemanticPreview>
  );
};

export default App;
