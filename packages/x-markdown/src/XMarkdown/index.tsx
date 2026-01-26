import { clsx } from 'clsx';
import React, { useMemo } from 'react';
import { Parser, Renderer } from './core';
import DebugPanel from './DebugPanel';
import { useStreaming } from './hooks';
import { XMarkdownProps } from './interface';
import './index.css';

const XMarkdown: React.FC<XMarkdownProps> = React.memo((props) => {
  const {
    streaming,
    config,
    components,
    paragraphTag,
    content,
    children,
    rootClassName,
    className,
    style,
    openLinksInNewTab,
    dompurifyConfig,
    protectCustomTagNewlines,
    debug,
  } = props;

  // ============================ style ============================
  const mergedCls = clsx('x-markdown', rootClassName, className);

  // ============================ Streaming ============================
  const displayContent = useStreaming(content || children || '', { streaming, components });
  // ============================ Render ============================
  const parser = useMemo(
    () =>
      new Parser({
        markedConfig: config,
        paragraphTag,
        openLinksInNewTab,
        components,
        protectCustomTagNewlines,
      }),
    [config, paragraphTag, openLinksInNewTab, components, protectCustomTagNewlines],
  );

  const renderer = useMemo(
    () =>
      new Renderer({
        components: components,
        dompurifyConfig,
        streaming,
      }),
    [components, dompurifyConfig, streaming],
  );

  const htmlString = useMemo(() => {
    if (!displayContent) return '';
    return parser.parse(displayContent);
  }, [displayContent, parser]);

  if (!displayContent) return null;

  return (
    <>
      <div className={mergedCls} style={style}>
        {renderer.render(htmlString)}
      </div>
      {debug ? <DebugPanel /> : null}
    </>
  );
});

if (process.env.NODE_ENV !== 'production') {
  XMarkdown.displayName = 'XMarkdown';
}

export default XMarkdown;
