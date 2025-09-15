import { CopyOutlined } from '@ant-design/icons';
import useXComponentConfig from '@ant-design/x/es/_util/hooks/use-x-component-config';
import useLocale from '@ant-design/x/es/locale/useLocale';
import useXProviderContext from '@ant-design/x/es/x-provider/hooks/use-x-provider-context';
import locale_EN from '@ant-design/x/locale/en_US';
import { Button, message, Tooltip } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import type { PluginsType } from '../type';
import useStyle from './style';

const HighlightCode: PluginsType['HighlightCode'] = (props) => {
  const {
    lang,
    children,
    header,
    prefixCls: customizePrefixCls,
    className,
    classNames = {},
    styles = {},
    style,
    highlightProps,
  } = props;

  // ============================ locale ============================
  const [contextLocale] = useLocale('HighlightCode', locale_EN.HighlightCode);

  // ============================ Prefix ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('highlightCode', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('highlightCode');

  // ============================ style ============================
  const mergedCls = classnames(
    prefixCls,
    contextConfig.className,
    className,
    contextConfig.classNames.root,
    classNames.root,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );

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
      <div
        className={classnames(
          `${prefixCls}-header`,
          contextConfig.classNames.header,
          classNames.header,
        )}
        style={{ ...contextConfig.styles.header, ...styles.header }}
      >
        {contextHolder}
        <span
          className={classnames(
            `${prefixCls}-header-tile`,
            classNames.headerTitle,
            contextConfig.classNames.headerTitle,
          )}
          style={{ ...contextConfig.styles.headerTitle, ...styles.headerTitle }}
        >
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
    <div className={mergedCls} style={{ ...contextConfig.styles.root, ...style, ...styles.root }}>
      {renderTitle()}
      <div
        className={classnames(`${prefixCls}-code`, contextConfig.classNames.code, classNames.code)}
        style={{ ...contextConfig.styles.code, ...styles.code }}
      >
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
