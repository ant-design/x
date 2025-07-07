import React from 'react';
import { useStreaming } from './hooks';
import { XMarkdownProps } from './interface';
import { Parser, Renderer } from './core';
import classnames from 'classnames';
import useXProviderContext from '../hooks/use-x-provider-context';
import useStyle from './style';

const XMarkdown: React.FC<XMarkdownProps> = (props) => {
  const {
    content,
    children,
    gfm,
    breaks,
    streaming,
    plugins,
    components,
    prefixCls: customizePrefixCls,
    className,
    style,
  } = props;

  // ============================ style ============================
  const { getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('xmarkdown', customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(prefixCls, className, hashId, cssVarCls);

  // ============================ Streaming ============================
  const displayContent = useStreaming(content || children || '', streaming);

  // ============================ Render ============================
  if (!displayContent) return null;

  const parser = new Parser({ gfm, breaks, plugins });
  const renderer = new Renderer({ components });

  const htmlString = parser.parse(displayContent);

  return wrapCSSVar(
    <div className={mergedCls} style={style}>
      {renderer.render(htmlString)}
    </div>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  XMarkdown.displayName = 'XMarkdown';
}

export default XMarkdown;
