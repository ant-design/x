import HighlightCode from '@ant-design/x-markdown/plugins/HighlightCode';
import React from 'react';
import SemanticPreview from '../../../../../.dumi/components/SemanticPreview';
import useLocale from '../../../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    header: '头部的容器',
  },
  en: {
    header: 'Wrapper element of the header',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview componentName="Bubble" semantics={[{ name: 'header', desc: locale.header }]}>
      <HighlightCode lang="typescript">console.log('XMarkdown')</HighlightCode>
    </SemanticPreview>
  );
};

export default App;
