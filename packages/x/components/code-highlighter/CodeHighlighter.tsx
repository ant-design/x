import { clsx } from 'clsx';
import React, { lazy, Suspense } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import Actions from '../actions';
import { useXProviderContext } from '../x-provider';
import type { CodeHighlighterProps } from './interface';
import useStyle from './style';

const customOneLight = {
  ...oneLight,
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    margin: 0,
  },
};

// Module-level cache for loaded language highlighters
const highlighterCache = new Map<string, React.LazyExoticComponent<React.ComponentType<any>>>();
// Full Prism highlighter (cached, loaded on demand)
let FullPrismHighlighter: React.LazyExoticComponent<React.ComponentType<any>> | null = null;

const getAsyncHighlighter = (lang: string) => {
  if (!highlighterCache.has(lang)) {
    const LazyHighlighter = lazy(async () => {
      try {
        await import(`react-syntax-highlighter/dist/esm/languages/prism/${lang}`);
      } catch (error) {
        console.warn(`[CodeHighlighter] Failed to load language: ${lang}`, error);
      }
      return {
        default: ({
          children,
          ...rest
        }: { children: string } & CodeHighlighterProps['highlightProps']) => (
          <SyntaxHighlighter language={lang} {...rest}>
            {children}
          </SyntaxHighlighter>
        ),
      };
    });
    highlighterCache.set(lang, LazyHighlighter);
  }
  return highlighterCache.get(lang)!;
};

const getFullPrismHighlighter = () => {
  if (!FullPrismHighlighter) {
    FullPrismHighlighter = lazy(() =>
      import('react-syntax-highlighter').then((module) => ({
        default: (props: any) => <module.Prism {...props} />,
      })),
    );
  }
  return FullPrismHighlighter;
};

const CodeHighlighter = React.forwardRef<HTMLDivElement, CodeHighlighterProps>((props, ref) => {
  const {
    lang,
    children,
    header,
    prefixCls: customizePrefixCls,
    className,
    classNames = {},
    styles = {},
    style = {},
    highlightProps,
    prismLightMode = true,
    ...restProps
  } = props;

  // ============================ Prefix ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('codeHighlighter', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const contextConfig = useXComponentConfig('codeHighlighter');

  // Get the appropriate highlighter component
  // - prismLightMode = true (default): Use PrismLight with async language loading
  // - prismLightMode = false: Use full Prism (all languages included)
  const Highlighter = prismLightMode
    ? lang
      ? getAsyncHighlighter(lang)
      : SyntaxHighlighter
    : getFullPrismHighlighter();

  // ============================ Early Returns ============================
  if (!children) {
    return null;
  }

  // No lang means no highlighting needed, return plain code directly
  if (!lang) {
    return <code>{children}</code>;
  }

  // ============================ style ============================
  const mergedCls = clsx(
    prefixCls,
    contextConfig.className,
    className,
    contextConfig.classNames?.root,
    classNames.root,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );

  const mergedStyle = {
    ...contextConfig.style,
    ...styles?.root,
    ...style,
  };

  // ============================ render content ============================
  const renderTitle = () => {
    if (header === null) return null;

    if (header) return header;

    return (
      <div
        className={clsx(`${prefixCls}-header`, contextConfig.classNames?.header, classNames.header)}
        style={{ ...contextConfig.styles?.header, ...styles.header }}
      >
        <span
          className={clsx(
            `${prefixCls}-header-title`,
            classNames.headerTitle,
            contextConfig.classNames?.headerTitle,
          )}
          style={{ ...contextConfig.styles?.headerTitle, ...styles.headerTitle }}
        >
          {lang}
        </span>
        <Actions.Copy text={children} />
      </div>
    );
  };

  // ============================ render ============================
  const codeElement = (
    <Highlighter
      language={lang}
      wrapLines={true}
      style={customOneLight}
      codeTagProps={{ style: { background: 'transparent' } }}
      {...highlightProps}
    >
      {children.replace(/\n$/, '')}
    </Highlighter>
  );

  // Determine if we need Suspense fallback
  // - Light mode with lang: async language loading
  // - Full mode: async full Prism loading
  // - Light mode without lang: sync, no Suspense needed
  const needsSuspense = prismLightMode ? !!lang : true;

  const highlightedCode = needsSuspense ? (
    <Suspense
      fallback={<code style={{ whiteSpace: 'pre-wrap' }}>{children.replace(/\n$/, '')}</code>}
    >
      {codeElement}
    </Suspense>
  ) : (
    codeElement
  );

  return (
    <div ref={ref} className={mergedCls} style={mergedStyle} {...restProps}>
      {renderTitle()}
      <div
        className={clsx(`${prefixCls}-code`, contextConfig.classNames?.code, classNames.code)}
        style={{ ...contextConfig.styles.code, ...styles.code }}
      >
        {highlightedCode}
      </div>
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  CodeHighlighter.displayName = 'CodeHighlighter';
}

export default CodeHighlighter;
