import classnames from 'classnames';
import React from 'react';
import useXProviderContext from '../hooks/use-x-provider-context';
import { Parser, Renderer } from './core';
import { useAnimation, useStreaming } from './hooks';
import { XMarkdownProps } from './interface';
import './index.less';

const XMarkdown: React.FC<XMarkdownProps> = (props) => {
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
  } = props;

  // ============================ style ============================
  const { direction: contextDirection, getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('x-markdown', customizePrefixCls);

  const mergedCls = classnames(prefixCls, 'x-markdown', rootClassName, className);

  const mergedStyle: React.CSSProperties = {
    direction: contextDirection === 'rtl' ? 'rtl' : 'ltr',
    ...style,
  };

  // ============================ Streaming ============================
  const displayContent = useStreaming(content || children || '', streaming);

  // ============================ animation ============================
  const animationComponents = useAnimation(streaming);

  // ============================ Render ============================
  if (!displayContent) return null;

  const parser = new Parser({
    markedConfig: config,
    paragraphTag,
    openLinksInNewTab,
  });

  const renderComponents = { ...animationComponents, ...(components || {}) };
  const renderer = new Renderer({
    components: renderComponents,
  });

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
