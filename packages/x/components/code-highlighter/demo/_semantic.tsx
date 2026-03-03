import { CodeHighlighter } from '@ant-design/x';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    header: '头部的容器',
    headerTitle: '标题',
    code: '代码容器',
  },
  en: {
    root: 'root',
    header: 'Wrapper element of the header',
    headerTitle: 'Wrapper element of the headerTitle',
    code: 'Wrapper element of the code',
  },
};

const content = `import React from 'react';
import { XMarkdown } from '@ant-design/x-markdown';

const App = () => <XMarkdown content='Hello World' />;
export default App;
`;

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      componentName="HighlightCode"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'header', desc: locale.header },
        { name: 'headerTitle', desc: locale.headerTitle },
        { name: 'code', desc: locale.code },
      ]}
    >
      <CodeHighlighter lang="typescript">{content}</CodeHighlighter>
    </SemanticPreview>
  );
};

export default App;
