import { CopyOutlined } from '@ant-design/icons';
import { Button, message, Tooltip } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import useXProviderContext from '../hooks/use-x-provider-context';
import type { PluginsType } from '../type';
import useStyle from './style';
import useLocale from '@ant-design/x/es/locale/useLocale';
import locale_EN from '@ant-design/x/locale/en_US';

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

  // ============================ locale ============================
  const [contextLocale] = useLocale('HighlightCode', locale_EN.HighlightCode);

  // ============================ style ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('highlightCode', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(prefixCls, className, classNames?.root, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  // ============================ locale ============================
  const [messageApi, contextHolder] = message.useMessage();

  const handleCopyCode = async () => {
    if (!children) return;

    try {
      await navigator.clipboard.writeText(children.trim());
      messageApi.open({
        type: 'success',
        content: contextLocale.copySuccess,
      });
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const renderTitle = () => {
    if (header === null) return null;

    if (header) return header;

    return (
      <div className={classnames(`${prefixCls}-header`, classNames?.header)} style={styles.header}>
        {contextHolder}
        <span className={classNames?.headerTitle} style={styles.headerTitle}>
          {lang}
        </span>
        <Tooltip title={contextLocale.copy}>
          <Button type="text" size="small" icon={<CopyOutlined />} onClick={handleCopyCode} />
        </Tooltip>
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
    <div className={mergedCls} style={{ ...style, ...styles.root }}>
      {renderTitle()}
      <div className={classnames(`${prefixCls}-code`, classNames?.code)} style={styles.code}>
        <SyntaxHighlighter
          customStyle={{
            padding: 0,
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
