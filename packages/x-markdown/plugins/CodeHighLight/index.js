import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
const CodeHighlight = () => {
  const id = React.useId();
  return {
    code(props) {
      const {
        lang,
        children
      } = props;
      if (lang === 'mermaid') return false;
      const key = `${lang}-${id}-${children?.length}`;
      return /*#__PURE__*/React.createElement(SyntaxHighlighter, {
        key: key,
        language: lang
      }, children);
    }
  };
};
export default CodeHighlight;