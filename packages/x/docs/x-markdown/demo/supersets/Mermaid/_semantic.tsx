import Mermaid from '@ant-design/x-markdown/plugins/Mermaid';
import React from 'react';
import SemanticPreview from '../../../../../.dumi/components/SemanticPreview';
import useLocale from '../../../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    header: '头部的容器',
    headerTitle: '标题',
    graph: '图片的容器',
    code: '代码容器',
  },
  en: {
    root: 'root',
    header: 'Wrapper element of the header',
    headerTitle: 'Wrapper element of the headerTitle',
    graph: 'Wrapper element of the graph',
    code: 'Wrapper element of the code',
  },
};

const content = `
graph TD
    A[Start] --> B{Data Valid?}
    B -->|Yes| C[Process Data]
    B -->|No| D[Error Handling]
    C --> E[Generate Report]
    D --> E
    E --> F[End]
    style A fill:#2ecc71,stroke:#27ae60
    style F fill:#e74c3c,stroke:#c0392b`;

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      componentName="Mermaid"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'header', desc: locale.header },
        { name: 'headerTitle', desc: locale.headerTitle },
        { name: 'graph', desc: locale.graph },
        { name: 'code', desc: locale.code },
      ]}
    >
      <Mermaid>{content}</Mermaid>
    </SemanticPreview>
  );
};

export default App;
