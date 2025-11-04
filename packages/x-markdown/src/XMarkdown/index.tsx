import classnames from 'classnames';
import React, { useMemo } from 'react';
import useXProviderContext from '../hooks/use-x-provider-context';
import { Parser, Renderer } from './core';
import { useStreaming } from './hooks';
import { XMarkdownProps } from './interface';
import './index.less';

const XMarkdown: React.FC<XMarkdownProps> = (props) => {
  const {
    streaming,
    config,
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
  } = props;

  const components = useMemo(() => {
    return Object.assign(
      {
        'xmd-footer': footer,
      },
      props?.components ?? {},
    );
  }, [footer, props?.components]);

  // ============================ style ============================
  const { direction: contextDirection, getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('x-markdown', customizePrefixCls);

  const mergedCls = classnames(prefixCls, 'x-markdown', rootClassName, className);

  const mergedStyle: React.CSSProperties = {
    direction: contextDirection === 'rtl' ? 'rtl' : 'ltr',
    ...style,
  };

  // ============================ Streaming ============================
  const output = useStreaming(content || children || '', streaming);

  const displayContent = useMemo(() => {
    if (streaming?.hasNextChunk) {
      return output + '<xmd-footer></xmd-footer>';
    }

    return !footer ? output : output.replace(/<xmd-footer><\/xmd-footer>/g, '') || '';
  }, [streaming?.hasNextChunk, output, footer]);

  // ============================ Render ============================
  if (!displayContent) return null;

  const parser = new Parser({
    markedConfig: config,
    paragraphTag,
    openLinksInNewTab,
    configureRenderCleaner: (code: string, type) => {
      if (type === 'code') {
        return !footer ? code : code.replace(/<xmd-footer><\/xmd-footer>/g, '') || '';
      }

      return code;
    },
  });

  const renderer = new Renderer({
    components: components,
    dompurifyConfig,
    streaming,
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
