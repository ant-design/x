import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Token } from '../../interface';

type Extension = {
  renderer: any;
};

const CodeHighLight = (): Extension => {
  return {
    renderer: {
      code(token: Token) {
        return token.lang !== 'mermaid' ? (
          <SyntaxHighlighter language={token.lang}>{token.text}</SyntaxHighlighter>
        ) : (
          false
        );
      },
    },
  };
};

export default CodeHighLight;
