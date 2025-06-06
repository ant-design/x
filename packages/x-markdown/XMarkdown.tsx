import { MarkdownProps } from './interface';
import React from 'react';
import useBuffer from './hooks/useBuffer';
import { Lexer, Parser, processOptions, Renderer } from './core/index';
import { useXProviderContext } from '../x/components/x-provider';
import classnames from 'classnames';
import { walkTokens } from 'marked';

const Markdown: React.FC<MarkdownProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    plugins,
    components,
    content,
    buffer,
    children,
  } = props;

  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('markdown', customizePrefixCls);

  // ============================ Style ============================
  const mergedCls = classnames(prefixCls, rootClassName);

  // ============================ Buffer ============================
  const displayContent = useBuffer(content || children || '', buffer);

  // ============================ Render ============================
  const options = processOptions(plugins, components);
  const lexer = new Lexer(options);
  const parser = new Parser(options);
  const tokens = lexer.lex(displayContent);

  console.log('tokens', tokens);

  if (options.walkTokens) {
    walkTokens(tokens, options.walkTokens);
  }
  return <div className={mergedCls}>{parser.parse(tokens)}</div>;
};

if (process.env.NODE_ENV !== 'production') {
  Markdown.displayName = 'Markdown';
}

export default Markdown;
