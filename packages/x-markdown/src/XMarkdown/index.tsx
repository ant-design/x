import { MarkdownProps } from './interface';
import React from 'react';
import useBuffer from './hooks/useBuffer';
import { Lexer, Parser, processOptions } from './core/index';
import useXProviderContext from './hooks/use-x-provider-context';
import { walkTokens } from 'marked';

const Markdown: React.FC<MarkdownProps> = (props) => {
  const { content, streaming, children, plugins, components, className, style } = props;

  // ============================ Prefix ============================
  const { theme } = useXProviderContext();

  // ============================ Buffer ============================
  const displayContent = useBuffer(content || children || '', streaming);

  // ============================ Render ============================
  const options = processOptions(plugins, components);
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
  Markdown.displayName = 'Markdown';
}

export default Markdown;
