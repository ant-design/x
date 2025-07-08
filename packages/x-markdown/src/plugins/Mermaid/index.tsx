import { Segmented } from 'antd';
import classnames from 'classnames';
import throttle from 'lodash.throttle';
import mermaid from 'mermaid';
import React, { useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import useXProviderContext from '../../hooks/use-x-provider-context';
import type { PluginsType } from '../type';
import useStyle from './style';

enum RenderType {
  Code = '代码',
  Image = '图片',
}

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'default',
  fontFamily: 'monospace',
});

let uuid = 0;

const Mermaid: PluginsType['Mermaid'] = React.memo((props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    classNames,
    style,
    header,
    children,
    highlightProps,
  } = props;
  const [renderType, setRenderType] = useState(RenderType.Image);
  const containerRef = useRef<HTMLDivElement>(null);
  const id = `mermaid-${uuid++}-${children.length}`;

  // ============================ style ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('mermaid', customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(prefixCls, className, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  // ============================ render mermaid ============================
  const renderDiagram = throttle(async () => {
    if (!children || !containerRef.current) return;

    try {
      const isValid = await mermaid.parse(children, { suppressErrors: true });
      if (!isValid) throw new Error('Invalid Mermaid syntax');

      const newText = children.replace(/[`\s]+$/g, '');
      const { svg } = await mermaid.render(id, newText, containerRef.current);

      containerRef.current.innerHTML = svg;
    } catch (error) {
      console.warn(`Mermaid render failed: ${error}`);
    }
  }, 100);

  useEffect(() => {
    renderDiagram();
  }, [children]);

  // ============================ render content ============================
  if (!children) return null;

  const renderHeader = () => {
    if (header === null) return null;

    if (header) return header;

    return (
      <div className={classnames(`${prefixCls}-header`, classNames?.header)}>
        <span className={classNames?.headerTitle}>mermaid</span>
        <Segmented
          options={[RenderType.Image, RenderType.Code]}
          value={renderType}
          onChange={setRenderType}
        />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <>
        <div
          className={classnames(
            `${prefixCls}-mermaid`,
            renderType === RenderType.Code && `${prefixCls}-mermaid-hidden`,
            classNames?.mermaid,
          )}
          ref={containerRef}
        />
        {renderType === RenderType.Code && (
          <SyntaxHighlighter
            customStyle={{
              marginTop: 0,
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
              border: '1px solid #f6f6f6',
              background: 'transparent',
              borderTop: 0,
              fontSize: 14,
              paddingLeft: 16,
            }}
            language="mermaid"
            showLineNumbers={true}
            wrapLines={true}
            CodeTag="div"
            {...highlightProps}
          >
            {children.replace(/\n$/, '')}
          </SyntaxHighlighter>
        )}
      </>
    );
  };

  return wrapCSSVar(
    <div className={mergedCls} style={style}>
      {renderHeader()}
      {renderContent()}
    </div>,
  );
});

export default Mermaid;
