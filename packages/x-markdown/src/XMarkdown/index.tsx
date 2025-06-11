import { walkTokens } from 'marked';
import React from 'react';
import { Lexer, Parser, Renderer, processOptions } from './core';
import useBuffer from './hooks/useBuffer';
import { MarkdownProps } from './interface';

const Markdown: React.FC<MarkdownProps> = (props) => {
  const { content, streaming, children, plugins, components, className, style } = props;

  // ============================ Prefix ============================
  // const { theme } = useXProviderContext();

  // ============================ Buffer ============================
  const displayContent = useBuffer(content || children || '', streaming);

  // ============================ Render ============================
  const renderer = new Renderer();
  const options = processOptions(renderer, plugins, components);
  const lexer = new Lexer(options);
  const parser = new Parser(options);
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
  Markdown.displayName = 'XMarkdown';
}

export default Markdown;
