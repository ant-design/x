import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

type CodeProps = {
  type: string;
  lang: string;
  text: string;
  children: string;
};

let uuid = 0;
const HighlightCode = () => {
  return {
    code(props: CodeProps) {
      const { lang, children } = props;
      if (!lang) {
        return <code>{children}</code>;
      }
      const id = `${lang}-${uuid++}-${children?.length}`;
      return (
        <SyntaxHighlighter key={id} language={lang}>
          {children}
        </SyntaxHighlighter>
      );
    },
  };
};

export default HighlightCode;
