import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

type CodeProps = {
  type: string;
  lang: string;
  text: string;
  children: string;
};

const CodeHighlight = () => {
  const id = React.useId();

  return {
    code(props: CodeProps) {
      const { lang, children } = props;
      if (lang === 'mermaid') return false;

      const key = `${lang}-${id}-${children.length}`;
      return (
        <SyntaxHighlighter key={key} language={lang}>
          {children}
        </SyntaxHighlighter>
      );
    },
  };
};

export default CodeHighlight;
