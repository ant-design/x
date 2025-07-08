import classnames from 'classnames';
import React from 'react';
import useXProviderContext from '../hooks/use-x-provider-context';
import { Parser, Renderer } from './core';
import { useStreaming } from './hooks';
import { XMarkdownProps } from './interface';

const XMarkdown: React.FC<XMarkdownProps> = (props) => {
  const { streaming, config, components, content, children, rootClassName, className, style } =
    props;

  // ============================ style ============================
  const { direction: contextDirection } = useXProviderContext();

  const mergedCls = classnames(rootClassName, className);
  const mergedStyle: React.CSSProperties = {
    direction: contextDirection === 'rtl' ? 'rtl' : 'ltr',
    ...style,
  };

  // ============================ Streaming ============================
  const displayContent = useStreaming(content || children || '', streaming);

  // ============================ Render ============================
  if (!displayContent) return null;

  const parser = new Parser(config);
  const renderer = new Renderer({ components });

  const htmlString = parser.parse(displayContent);

  return (
    <div className={mergedCls} style={mergedStyle}>
      {renderer.render(htmlString)}
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  XMarkdown.displayName = 'XMarkdown';
}

export default XMarkdown;
