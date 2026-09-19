import { clsx } from 'clsx';
import React, { useMemo } from 'react';
import { Parser, Renderer } from './core';
import DebugPanel from './DebugPanel';
import { useStreamingCore, useTypewriter } from './hooks';
import { XMarkdownProps } from './interface';
import Section from './Section';
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
  // The typewriter runs first so that what reaches the streaming cache is
  // always a prefix of the previous value.
  const pacedContent = useTypewriter(
    content || children || '',
    streaming?.typewriter,
    !!streaming?.hasNextChunk,
  );
  const { output, sections } = useStreamingCore(pacedContent, { streaming, components });

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

  const renderer = useMemo(
    () =>
      new Renderer({
        components: mergedComponents,
        componentsProps,
        dompurifyConfig,
        streaming,
      }),
    [mergedComponents, componentsProps, dompurifyConfig, streaming],
  );

  const htmlString = useMemo(() => {
    if (!output || sections) {
      return '';
    }

    return parser.parse(output, { injectTail: !!shouldShowTail });
  }, [output, sections, parser, shouldShowTail]);

  const renderedContent = useMemo(
    () => (htmlString ? renderer.render(htmlString) : null),
    [htmlString, renderer],
  );

  if (!output) {
    return null;
  }

  // Sections are rendered as siblings inside the same root element, so the
  // DOM is identical to the whole-document render; only the React tree differs.
  const sectionedContent = sections
    ? sections.map((section, index) => (
        <Section
          // Sections are positional: section N is stable once section N+1 exists.
          key={index}
          content={section}
          parser={parser}
          renderer={renderer}
          injectTail={!!shouldShowTail && index === sections.length - 1}
        />
      ))
    : null;

  return (
    <>
      <div className={mergedCls} style={style}>
        {sectionedContent ?? renderedContent}
      </div>
      {debug ? <DebugPanel /> : null}
    </>
  );
});

if (process.env.NODE_ENV !== 'production') {
  XMarkdown.displayName = 'XMarkdown';
}

export default XMarkdown;
