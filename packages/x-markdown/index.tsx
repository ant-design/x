import { MarkdownProps } from './interface';
import React from 'react';
import useBuffer from './hooks/useBuffer';
import { Lexer, Parser } from './core';
import { processOptions } from './core/helpers';
import { useXProviderContext } from '../x/components/x-provider';

const Markdown: React.FC<MarkdownProps> = (props) => {
  const { prefixCls: customizePrefixCls, plugins, components, content, buffer, children } = props;

  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('markdown', customizePrefixCls);

  // ============================ Buffer ============================
  const displayContent = useBuffer(content || children || '', buffer);

  // ============================ Render ============================
  const options = processOptions(plugins, components);
  const lexer = new Lexer(options);
  const parser = new Parser(options);
  const tokens = lexer.lex(displayContent);

  return <div className={prefixCls}>{parser.parse(tokens)}</div>;
};

if (process.env.NODE_ENV !== 'production') {
  Markdown.displayName = 'Markdown';
}

export default Markdown;
