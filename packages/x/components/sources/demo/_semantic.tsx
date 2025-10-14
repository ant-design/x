import { Sources } from '@ant-design/x';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    title: '标题区',
    content: '内容区',
  },
  en: {
    root: 'Root',
    title: 'Title',
    content: 'Content',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  const items = [
    {
      title: '1. Data source',
      url: 'https://x.ant.design/components/overview',
    },
    {
      title: '2. Data source',
      url: 'https://x.ant.design/components/overview',
    },
    {
      title: '3. Data source',
      url: 'https://x.ant.design/components/overview',
    },
  ];

  return (
    <SemanticPreview
      componentName="Sources"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'title', desc: locale.title },
        { name: 'content', desc: locale.content },
      ]}
    >
      <Sources title={'Used 3 sources'} items={items} />
    </SemanticPreview>
  );
};

export default App;
