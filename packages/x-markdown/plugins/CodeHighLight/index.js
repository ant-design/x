import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
const CodeHighlight = () => {
  const id = React.useId();
  return {
    renderer: {
      code(token) {
        const { lang, text } = token;
        if (lang === 'mermaid') return false;
        const key = `${lang}-${id}-${text.length}`;
        return /*#__PURE__*/ React.createElement(
          SyntaxHighlighter,
          {
            key: key,
            language: token.lang,
          },
          text,
        );
      },
    },
  };
};
export default CodeHighlight;
