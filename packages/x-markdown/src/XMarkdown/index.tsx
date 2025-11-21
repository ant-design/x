import classnames from 'classnames';
import React, { useMemo } from 'react';
import useXProviderContext from '../hooks/use-x-provider-context';
import { Parser, Renderer } from './core';
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
    prefixCls: customizePrefixCls,
    className,
    style,
    openLinksInNewTab,
    dompurifyConfig,
    footer,
    footerClassName,
    footerStyle,
  } = props;

  // ============================ style ============================
  const { direction: contextDirection, getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('x-markdown', customizePrefixCls);

  const mergedCls = classnames(prefixCls, 'x-markdown', rootClassName, className);

  const mergedStyle: React.CSSProperties = useMemo(
    () => ({
      direction: contextDirection === 'rtl' ? 'rtl' : 'ltr',
      ...style,
    }),
    [contextDirection, style],
  );

  const mergedFooterStyle: React.CSSProperties = useMemo(
    () => ({
      direction: contextDirection === 'rtl' ? 'rtl' : 'ltr',
      ...footerStyle,
    }),
    [contextDirection, footerStyle],
  );

  // ============================ Streaming ============================
  const displayContent = useStreaming(content || children || '', streaming);

  // ============================ Render ============================
  const parser = useMemo(
    () =>
      new Parser({
        markedConfig: config,
        paragraphTag,
        openLinksInNewTab,
      }),
    [config, paragraphTag, openLinksInNewTab],
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

  // Memoize footer rendering to prevent unnecessary re-renders
  const footerElement = useMemo(() => {
    if (!footer) return null;
    return (
      <div
        className={classnames(`${prefixCls}-footer`, footerClassName)}
        style={mergedFooterStyle}
        key="x-markdown-footer"
      >
        {footer}
      </div>
    );
  }, [footer, prefixCls, footerClassName, mergedFooterStyle]);

  if (!displayContent && !footer) return null;

  return (
    <div className={classnames(`${prefixCls}-container`, mergedCls)} style={mergedStyle}>
      <div className={`${prefixCls}-content`}>
        {displayContent ? renderer.render(htmlString) : null}
      </div>
      {footerElement}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  XMarkdown.displayName = 'XMarkdown';
}

export default XMarkdown;
