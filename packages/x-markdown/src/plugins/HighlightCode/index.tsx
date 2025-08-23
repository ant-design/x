import classnames from 'classnames';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import useXProviderContext from '../hooks/use-x-provider-context';
import type { PluginsType } from '../type';
import useStyle from './style';

const HighlightCode: PluginsType['HighlightCode'] = (props) => {
  const {
    lang,
    children,
    header,
    prefixCls: customizePrefixCls,
    className,
    classNames,
    styles = {},
    style,
    highlightProps,
  } = props;

  // ============================ style ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('highlightCode', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(prefixCls, className, classNames?.root, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  // ============================ render ============================
  if (!lang) {
    return <code>{children}</code>;
  }

  if (!children) return null;

  const renderTitle = () => {
    if (header === null) return null;

    if (header) return header;

    return (
      <div className={classnames(`${prefixCls}-header`, classNames?.header)} style={styles.header}>
        <span className={classNames?.headerTitle} style={styles.headerTitle}>
          {lang}
        </span>
      </div>
    );
  };

  return (
    <div className={mergedCls} style={{ ...style, ...styles.root }}>
      {renderTitle()}
      <div className={classNames?.code} style={styles.code}>
        <SyntaxHighlighter
          customStyle={{
            marginTop: 0,
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            border: '1px solid #f6f6f6',
            borderTop: 0,
            fontSize: 14,
            padding: 16,
            background: 'transparent',
          }}
          language={lang}
          wrapLines={true}
          style={tomorrow}
          {...highlightProps}
        >
          {children.replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default HighlightCode;
