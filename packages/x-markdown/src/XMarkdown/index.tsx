import React from 'react';
import { useStreaming } from './hooks';
import { XMarkdownProps } from './interface';
import { Parser, Renderer } from './core';
import classnames from 'classnames';
import useXProviderContext from '../hooks/use-x-provider-context';

const XMarkdown: React.FC<XMarkdownProps> = (props) => {
  const {
    content,
    children,
    gfm,
    breaks,
    streaming,
    plugins,
    components,
    rootClassName,
    className,
    style,
  } = props;

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

  const parser = new Parser({ gfm, breaks, plugins });
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
