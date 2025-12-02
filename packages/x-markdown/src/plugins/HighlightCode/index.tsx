import useXComponentConfig from '@ant-design/x/es/_util/hooks/use-x-component-config';
import Actions from '@ant-design/x/es/actions';
import useXProviderContext from '@ant-design/x/es/x-provider/hooks/use-x-provider-context';
import classnames from 'classnames';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { HighlightCodeProps } from '../type';
import useStyle from './style';

const customOneLight = {
  ...oneLight,
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    margin: 0,
  },
};

const HighlightCode: React.FC<HighlightCodeProps> = (props) => {
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

  // ============================ render content ============================
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
        <span
          className={classnames(
            `${prefixCls}-header-title`,
            classNames.headerTitle,
            contextConfig.classNames.headerTitle,
          )}
          style={{ ...contextConfig.styles.headerTitle, ...styles.headerTitle }}
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
    <div className={mergedCls} style={{ ...contextConfig.styles.root, ...style, ...styles.root }}>
      {renderTitle()}
      <div
        className={classnames(`${prefixCls}-code`, contextConfig.classNames.code, classNames.code)}
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
};

export default HighlightCode;
