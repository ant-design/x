import { Marked, walkTokens } from 'marked';
import React from 'react';
import { Parser, createMarkdownConfig } from './core';
import useStreaming from './hooks/useStreaming';
import { XMarkdownProps } from './interface';

const XMarkdown: React.FC<XMarkdownProps> = (props) => {
  const {
    content,
    children,
    options,
    streaming,
    plugins,
    components,
    walkTokens: csWalkToken,
    className,
    style,
  } = props;

  // ============================ Render ============================
  const displayContent = useStreaming(content || children || '', streaming);
  if (!displayContent) return null;

  const config = createMarkdownConfig(options, plugins, components, streaming);

  const markedInstance = new Marked({
    breaks: config.break,
    gfm: config.gfm,
    extensions: config.plugins,
  });

  if (markedInstance.defaults.extensions) {
    config.extensions = markedInstance.defaults.extensions;
  }

  const parser = new Parser(config);

  const tokens = markedInstance.lexer(displayContent);

  if (csWalkToken) {
    walkTokens(tokens, csWalkToken);
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
