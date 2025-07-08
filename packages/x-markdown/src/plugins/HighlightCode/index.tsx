import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import useXProviderContext from '../../hooks/use-x-provider-context';
import useStyle from './style';
import classnames from 'classnames';
import type { PluginsType } from '../type';

const HighlightCode: PluginsType['HighlightCode'] = (props) => {
  const {
    lang,
    children,
    header,
    prefixCls: customizePrefixCls,
    className,
    classNames,
    style,
    highlightProps,
  } = props;

  // ============================ style ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('highlightCode', customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(prefixCls, className, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  // ============================ render ============================
  if (!children) return null;

  if (!lang) {
    return <code>{children}</code>;
  }

  const renderTitle = () => {
    if (header === null) return null;

    if (header) return header;

    return (
      <div className={classnames(`${prefixCls}-header`, classNames?.header)}>
        <span className={classNames?.headerTitle}>{lang}</span>
      </div>
    );
  };

  return wrapCSSVar(
    <div className={mergedCls} style={style}>
      {renderTitle()}
      <SyntaxHighlighter
        customStyle={{
          marginTop: 0,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          border: '1px solid #f6f6f6',
          borderTop: 0,
          fontSize: 14,
          padding: 16,
        }}
        language={lang}
        wrapLines={true}
        CodeTag="div"
        style={tomorrow}
        {...highlightProps}
      >
        {children.replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>,
  );
};

export default HighlightCode;
