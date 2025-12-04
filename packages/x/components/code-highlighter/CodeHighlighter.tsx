import classnames from 'classnames';
import React from 'react';
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
    ...restProps
  } = props;

  // ============================ Prefix ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('codeHighlighter', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('codeHighlighter');

  // ============================ style ============================
  const mergedCls = classnames(
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
        className={classnames(
          `${prefixCls}-header`,
          contextConfig.classNames?.header,
          classNames.header,
        )}
        style={{ ...contextConfig.styles?.header, ...styles.header }}
      >
        <span
          className={classnames(
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
  if (!children) {
    return null;
  }

  if (!lang) {
    return <code>{children}</code>;
  }

  return (
    <div ref={ref} className={mergedCls} style={mergedStyle} {...restProps}>
      {renderTitle()}
      <div
        className={classnames(`${prefixCls}-code`, contextConfig.classNames?.code, classNames.code)}
        style={{ ...contextConfig.styles.code, ...styles.code }}
      >
        <SyntaxHighlighter
          language={lang}
          wrapLines={true}
          style={customOneLight}
          {...highlightProps}
        >
          {children.replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  CodeHighlighter.displayName = 'CodeHighlighter';
}

export default CodeHighlighter;
