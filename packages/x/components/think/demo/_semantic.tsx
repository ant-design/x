import { Think } from '@ant-design/x';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    status: '状态区',
    content: '内容区',
  },
  en: {
    root: 'Root',
    status: 'Status',
    content: 'Content',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      componentName="Sender"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'status', desc: locale.status },
        { name: 'content', desc: locale.content },
      ]}
    >
      <Think title={'deep thinking'}>This is deep thinking content.</Think>
    </SemanticPreview>
  );
};

export default App;
