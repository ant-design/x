import { clsx } from 'clsx';
import React, { lazy, Suspense } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
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

// Full Prism highlighter (cached, loaded on demand)
let FullPrismHighlighter: React.LazyExoticComponent<React.ComponentType<any>> | null = null;

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
  // - prismLightMode = true (default): Use PrismAsyncLight, which loads AND registers the
  //   grammar for `lang` on demand through a statically analyzable loader map
  // - prismLightMode = false: Use full Prism (all languages included)
  const Highlighter = prismLightMode ? SyntaxHighlighter : getFullPrismHighlighter();

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

  // ============================ render header ============================
  const renderHeader = () => {
    if (header === undefined) {
      return (
        <div
          className={clsx(
            `${prefixCls}-header`,
            contextConfig.classNames?.header,
            classNames.header,
          )}
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
    }

    const headerResult = typeof header === 'function' ? header() : header;

    if (headerResult === false) {
      return null;
    }

    return headerResult;
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

  const highlightedCode = (
    <Suspense
      fallback={<code style={{ whiteSpace: 'pre-wrap' }}>{children.replace(/\n$/, '')}</code>}
    >
      {codeElement}
    </Suspense>
  );

  return (
    <div ref={ref} className={mergedCls} style={mergedStyle} {...restProps}>
      {renderHeader()}
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
