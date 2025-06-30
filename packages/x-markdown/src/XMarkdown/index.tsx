import htmlParse from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import { Marked, walkTokens } from 'marked';
import React from 'react';
import { Lexer, Parser, Renderer, createMarkdownOptions } from './core';
import useStreaming from './hooks/useStreaming';
import { XMarkdownProps } from './interface';

const XMarkdown: React.FC<XMarkdownProps> = (props) => {
  const { content, children, config, allowHtml, streaming, plugins, components, className, style } =
    props;

  // ============================ Streaming ============================
  const displayContent = useStreaming(content || children || '', streaming, components);

  // ============================ Render ============================
  if (allowHtml) {
    const htmlString = new Marked().parse(displayContent) as string;
    return (
      <div className={className} style={style}>
        {htmlParse(DOMPurify.sanitize(htmlString))}
      </div>
    );
  }

  const renderer = new Renderer();
  const options = createMarkdownOptions(renderer, plugins, components, config);
  const lexer = new Lexer(options);
  const parser = new Parser(options);

  if (!displayContent) return null;

  const tokens = lexer.lex(displayContent);

  if (options.walkTokens) {
    walkTokens(tokens, options.walkTokens);
  }
  return (
    <div className={className} style={style}>
      {parser.parse(tokens)}
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  XMarkdown.displayName = 'XMarkdown';
}

export default XMarkdown;
