import { clsx } from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import { Parser, Renderer } from './core';
import DebugPanel from './DebugPanel';
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
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>(null);

  // ============================ style ============================
  const mergedCls = clsx('x-markdown', rootClassName, className);

  // ============================ Parser ============================
  const parser = useMemo(
    () =>
      new Parser({
        markedConfig: config,
        paragraphTag,
        openLinksInNewTab,
        components,
        protectCustomTagNewlines,
        streaming,
      }),
    [config, paragraphTag, openLinksInNewTab, components, protectCustomTagNewlines, streaming],
  );

  // ============================ Renderer ============================
  const renderer = useMemo(
    () =>
      new Renderer({
        components,
        dompurifyConfig,
        streaming,
      }),
    [components, dompurifyConfig, streaming],
  );

  useEffect(() => {
    const displayContent = content || children;
    if (!displayContent) {
      setRenderedContent(null);
      return;
    }

    let isCancelled = false;

    parser
      .parse(displayContent, (html) => {
        if (!isCancelled) {
          setRenderedContent(renderer.render(html));
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          console.error('Failed to parse or render markdown:', error);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [content, children, parser, renderer]);

  return (
    <>
      <div className={mergedCls} style={style}>
        {renderedContent}
      </div>
      {debug ? <DebugPanel /> : null}
    </>
  );
});

if (process.env.NODE_ENV !== 'production') {
  XMarkdown.displayName = 'XMarkdown';
}

export default XMarkdown;
