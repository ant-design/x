import { clsx } from 'clsx';
import React, { lazy, Suspense, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
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
    prismLightMode = false,
    ...restProps
  } = props;

  // ============================ Prefix ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('codeHighlighter', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const contextConfig = useXComponentConfig('codeHighlighter');

  // Create async highlighter when prismLightMode is true
  const AsyncHighlighter = useMemo(() => {
    if (!prismLightMode) {
      return SyntaxHighlighter;
    }

    // Create async component for dynamic import
    const AsyncSyntaxHighlighter = lazy(async () => {
      try {
        // Try to import the language if lang exists
        if (lang) {
          const langModule = await import(`prismjs/components/prism-${lang}`);

          if (langModule) {
            // Return the highlighter with the loaded language
            return {
              default: (props: any) => (
                <SyntaxHighlighter {...props} language={lang} PreTag="div" />
              ),
            };
          }
        }
      } catch (error) {
        if (lang) {
          console.warn(`[CodeHighlighter] Failed to load language: ${lang}`, error);
        }
      }

      // Fallback to default highlighter if language loading fails or no lang
      return {
        default: (props: any) => <SyntaxHighlighter {...props} language={lang} PreTag="div" />,
      };
    });

    return AsyncSyntaxHighlighter;
  }, [prismLightMode, lang]);

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
  const Highlighter = AsyncHighlighter;
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

  // Wrap with Suspense when using async highlighter
  const highlightedCode = prismLightMode ? (
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
