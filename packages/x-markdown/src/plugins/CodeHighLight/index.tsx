import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Token, plugin } from './interface';

const CodeHighLight = (): plugin => {
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
