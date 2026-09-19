import { clsx } from 'clsx';
import React, { useMemo } from 'react';
import { Parser, Renderer } from './core';
import DebugPanel from './DebugPanel';
import { useStreaming } from './hooks';
import { XMarkdownProps } from './interface';
import { resolveTailContent } from './utils/tail';
import './index.css';

const XMarkdown: React.FC<XMarkdownProps> = React.memo((props) => {
  const {
    streaming,
    config,
    components,
    componentsProps,
    paragraphTag,
    content,
    children,
    rootClassName,
    className,
    style,
    openLinksInNewTab,
    dompurifyConfig,
    protectCustomTagNewlines,
    disableCustomTagBlockMarkdown,
    escapeRawHtml,
    debug,
    disableDefaultStyles,
  } = props;
  const tailContent = useMemo(() => resolveTailContent(streaming?.tail), [streaming?.tail]);
  const TailComponent = typeof streaming?.tail === 'object' ? streaming.tail.component : undefined;
  const shouldShowTail = !!streaming?.hasNextChunk && tailContent;

  // ============================ style ============================
  const disableStyleCls = useMemo(() => {
    if (disableDefaultStyles === true) {
      return 'x-md-disable-all';
    }
    if (Array.isArray(disableDefaultStyles)) {
      return disableDefaultStyles.map((tag) => `x-md-disable-${tag}`);
    }
    return undefined;
  }, [disableDefaultStyles]);

  const mergedCls = clsx('x-markdown', disableStyleCls, rootClassName, className);

  // ============================ Streaming ============================
  const output = useStreaming(content || children || '', { streaming, components });

  // ============================ Merge components with xmd-tail ============================
  const mergedComponents = useMemo(() => {
    if (!shouldShowTail) {
      return components;
    }

    const TailElement = TailComponent ? (
      React.createElement(TailComponent, { content: tailContent })
    ) : (
      <span className="xmd-tail">{tailContent}</span>
    );

    return {
      ...components,
      'xmd-tail': () => TailElement,
    };
  }, [shouldShowTail, components, TailComponent, tailContent]);

  // ============================ Render ============================
  const parser = useMemo(
    () =>
      new Parser({
        markedConfig: config,
        paragraphTag,
        openLinksInNewTab,
        components: mergedComponents,
        protectCustomTagNewlines,
        disableCustomTagBlockMarkdown,
        escapeRawHtml,
      }),
    [
      config,
      paragraphTag,
      openLinksInNewTab,
      mergedComponents,
      protectCustomTagNewlines,
      disableCustomTagBlockMarkdown,
      escapeRawHtml,
    ],
  );

  // The renderer only reads these two fields out of `streaming`, so depending on
  // the whole object would throw the instance — and with it its subtree cache —
  // away on every chunk, since `hasNextChunk` forces callers to pass a fresh
  // object while the answer is still streaming.
  const rendererStreaming = useMemo(
    () => ({
      enableAnimation: streaming?.enableAnimation,
      animationConfig: streaming?.animationConfig,
    }),
    [
      streaming?.enableAnimation,
      streaming?.animationConfig?.fadeDuration,
      streaming?.animationConfig?.easing,
    ],
  );

  const renderer = useMemo(
    () =>
      new Renderer({
        components: mergedComponents,
        componentsProps,
        dompurifyConfig,
        streaming: rendererStreaming,
      }),
    [mergedComponents, componentsProps, dompurifyConfig, rendererStreaming],
  );

  const htmlString = useMemo(() => {
    if (!output) {
      return '';
    }

    return parser.parse(output, { injectTail: !!shouldShowTail });
  }, [output, parser, shouldShowTail]);

  const renderedContent = useMemo(
    () => (htmlString ? renderer.render(htmlString) : null),
    [htmlString, renderer],
  );

  if (!output) {
    return null;
  }

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
