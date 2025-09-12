import { CopyOutlined, DownloadOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import useLocale from '@ant-design/x/es/locale/useLocale';
import locale_EN from '@ant-design/x/locale/en_US';
import { Button, message, Segmented, Space, Tooltip } from 'antd';
import classnames from 'classnames';
import throttle from 'lodash.throttle';
import mermaid from 'mermaid';
import React, { useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import useXProviderContext from '../hooks/use-x-provider-context';
import type { PluginsType } from '../type';
import useStyle from './style';

enum RenderType {
  Code = 'code',
  Image = 'image',
}

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'default',
  fontFamily: 'monospace',
});

let uuid = 0;

const Mermaid: PluginsType['Mermaid'] = React.memo((props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    classNames,
    styles = {},
    header,
    children,
    highlightProps,
  } = props;
  const [renderType, setRenderType] = useState(RenderType.Image);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const id = `mermaid-${uuid++}-${children?.length || 0}`;
  const [messageApi, contextHolder] = message.useMessage();

  // ============================ locale ============================
  const [contextLocale] = useLocale('Mermaid', locale_EN.Mermaid);

  // ============================ style ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('mermaid', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(prefixCls, className, classNames?.root, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  // ============================ render mermaid ============================
  const renderDiagram = throttle(async () => {
    if (!children || !containerRef.current || renderType === RenderType.Code) return;

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
    if (renderType === RenderType.Code && containerRef.current) {
      // 清理图表内容，避免在代码视图下出现渲染错误
      containerRef.current.innerHTML = '';
    } else {
      renderDiagram();
    }
  }, [children, renderType]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || renderType !== RenderType.Image) return;

    let lastTime = 0;
    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastTime < 16) return;
      lastTime = now;

      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.max(0.5, Math.min(3, prev + delta)));
    };

    container.addEventListener('wheel', wheelHandler, { passive: false });

    return () => {
      container.removeEventListener('wheel', wheelHandler);
    };
  }, [renderType]);

  useEffect(() => {
    if (containerRef.current && renderType === RenderType.Image) {
      const svg = containerRef.current.querySelector('svg');
      if (svg) {
        svg.style.transform = `scale(${scale}) translate(${position.x}px, ${position.y}px)`;
        svg.style.transformOrigin = 'center';
        svg.style.transition = isDragging ? 'none' : 'transform 0.1s ease-out';
        svg.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    }
  }, [scale, position, renderType, isDragging]);

  // 鼠标拖动事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    if (renderType !== RenderType.Image) return;
    e.preventDefault();
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || renderType !== RenderType.Image) return;
    e.preventDefault();

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setPosition((prev) => ({
      x: prev.x + deltaX / scale,
      y: prev.y + deltaY / scale,
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // ============================ render content ============================
  if (!children) {
    return null;
  }

  const handleDownload = async () => {
    const svgElement = containerRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = svgElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      const link = document.createElement('a');
      link.download = `${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1);
      link.click();
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

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

  const renderHeader = () => {
    if (header === null) return null;
    if (header) return header;

    return (
      <div className={classnames(`${prefixCls}-header`, classNames?.header)} style={styles.header}>
        {contextHolder}
        <Segmented
          options={[
            { label: contextLocale.image, value: RenderType.Image },
            { label: contextLocale.code, value: RenderType.Code },
          ]}
          value={renderType}
          onChange={setRenderType}
        />
        <Space>
          <Tooltip title={contextLocale.copy}>
            <Button type="text" size="small" icon={<CopyOutlined />} onClick={handleCopyCode} />
          </Tooltip>
          {renderType === RenderType.Image ? (
            <>
              <Tooltip title={contextLocale.zoomOut}>
                <Button type="text" size="small" icon={<ZoomInOutlined />} onClick={handleZoomIn} />
              </Tooltip>
              <Tooltip title={contextLocale.zoomIn}>
                <Button
                  type="text"
                  size="small"
                  icon={<ZoomOutOutlined />}
                  onClick={handleZoomOut}
                />
              </Tooltip>
              <Tooltip title={contextLocale.zoomReset}>
                <Button type="text" size="small" onClick={handleReset}>
                  {contextLocale.zoomReset}
                </Button>
              </Tooltip>
              <Tooltip title={contextLocale.download}>
                <Button
                  type="text"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                />
              </Tooltip>
            </>
          ) : null}
        </Space>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <>
        <div
          className={classnames(
            `${prefixCls}-graph`,
            renderType === RenderType.Code && `${prefixCls}-graph-hidden`,
            classNames?.graph,
          )}
          style={styles.graph}
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {renderType === RenderType.Code ? (
          <div className={classnames(`${prefixCls}-code`, classNames?.code)} style={styles.code}>
            <SyntaxHighlighter
              customStyle={{
                padding: 0,
                background: 'transparent',
              }}
              language="mermaid"
              wrapLines={true}
              {...highlightProps}
            >
              {children.replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        ) : null}
      </>
    );
  };

  return (
    <div className={mergedCls} style={{ ...style, ...styles.root }}>
      {renderHeader()}
      {renderContent()}
    </div>
  );
});

export default Mermaid;
