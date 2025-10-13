import { Bubble } from '@ant-design/x';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '气泡根节点',
    body: '主体容器',
    content: '内容的容器',
  },
  en: {
    root: 'Bubble root',
    body: 'Wrapper element of the body',
    content: 'Wrapper element of the content',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      componentName="Bubble"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'body', desc: locale.body },
        { name: 'content', desc: locale.content },
      ]}
    >
      <Bubble.System content="Feel free to use Ant Design !" />
    </SemanticPreview>
  );
};

export default App;
