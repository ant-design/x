import { DownloadOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, Segmented, Tooltip } from 'antd';
import classnames from 'classnames';
import throttle from 'lodash.throttle';
import type { Mermaid as MermaidLib } from 'mermaid';
import React, { useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import Actions from '../actions';
import type { ItemType } from '../actions/interface';
import locale_EN from '../locale/en_US';
import useLocale from '../locale/useLocale';
import { useXProviderContext } from '../x-provider';
import useStyle from './style';

declare global {
  interface Window {
    mermaid?: MermaidLib;
  }
}

export type MermaidType = 'root' | 'header' | 'graph' | 'code';

export interface MermaidProps {
  children: string;
  header?: React.ReactNode | null;
  prefixCls?: string;
  style?: React.CSSProperties;
  className?: string;
  highlightProps?: Partial<React.ComponentProps<typeof SyntaxHighlighter>>;
  // Semantic
  classNames?: Partial<Record<MermaidType, string>>;
  styles?: Partial<Record<MermaidType, React.CSSProperties>>;
  onRenderTypeChange?: (value: RenderType) => void;
}

enum RenderType {
  Code = 'code',
  Image = 'image',
}

let uuid = 0;

const Mermaid: React.FC<MermaidProps> = React.memo((props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    classNames = {},
    styles = {},
    header,
    children,
    highlightProps,
    onRenderTypeChange,
  } = props;
  const [renderType, setRenderType] = useState(RenderType.Image);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const mermaidRef = useRef<any>(null);
  const id = `mermaid-${uuid++}-${children?.length || 0}`;

  // ============================ locale ============================
  const [contextLocale] = useLocale('Mermaid', locale_EN.Mermaid);

  // ============================ Prefix ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('mermaid', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('mermaid');

  // ============================ style ============================
  const mergedCls = classnames(
    prefixCls,
    contextConfig.className,
    contextConfig.classNames?.root,
    className,
    classNames.root,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );

  // ============================ render mermaid ============================
  const renderDiagram = throttle(async () => {
    if (!children || !containerRef.current || renderType === RenderType.Code) return;

    try {
      if (!mermaidRef.current) {
        const mermaidModule = await import('mermaid');
        mermaidRef.current = mermaidModule.default;
        mermaidRef.current.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'default',
          fontFamily: 'monospace',
        });
      }

      const isValid = await mermaidRef.current.parse(children, { suppressErrors: true });
      if (!isValid) throw new Error('Invalid Mermaid syntax');

      const newText = children.replace(/[`\s]+$/g, '');

      const { svg } = await mermaidRef.current.render(id, newText, containerRef.current);

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

  const renderHeader = () => {
    if (header === null) return null;
    if (header) return header;

    const items: ItemType[] =
      renderType === RenderType.Image
        ? [
            {
              key: 'zoomIn',
              icon: <ZoomInOutlined />,
              label: contextLocale.zoomIn,
              onItemClick: handleZoomIn,
            },
            {
              key: 'zoomOut',
              icon: <ZoomOutOutlined />,
              label: contextLocale.zoomOut,
              onItemClick: handleZoomOut,
            },
            {
              key: 'zoomReset',
              actionRender: () => (
                <Tooltip title={contextLocale.zoomReset}>
                  <Button type="text" size="small" onClick={handleReset}>
                    {contextLocale.zoomReset}
                  </Button>
                </Tooltip>
              ),
            },
            {
              key: 'download',
              icon: <DownloadOutlined />,
              label: contextLocale.download,
              onItemClick: handleDownload,
            },
          ]
        : [
            {
              key: 'copy',
              actionRender: () => {
                return <Actions.Copy text={children} />;
              },
            },
          ];

    return (
      <div
        className={classnames(
          `${prefixCls}-header`,
          contextConfig.classNames?.header,
          classNames?.header,
        )}
        style={{ ...contextConfig.styles?.header, ...styles.header }}
      >
        <Segmented
          options={[
            { label: contextLocale.image, value: RenderType.Image },
            { label: contextLocale.code, value: RenderType.Code },
          ]}
          value={renderType}
          onChange={(value) => {
            setRenderType(value as RenderType);
            onRenderTypeChange?.(value as RenderType);
          }}
        />
        <Actions items={items} />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <>
        <div
          className={classnames(
            `${prefixCls}-graph`,
            contextConfig.classNames?.graph,
            renderType === RenderType.Code && `${prefixCls}-graph-hidden`,
            classNames?.graph,
          )}
          style={{ ...contextConfig.styles?.graph, ...styles.graph }}
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {renderType === RenderType.Code ? (
          <div
            className={classnames(
              `${prefixCls}-code`,
              contextConfig.classNames?.code,
              classNames?.code,
            )}
            style={{ ...contextConfig.styles?.code, ...styles.code }}
          >
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
    <div
      className={mergedCls}
      style={{ ...style, ...contextConfig.style, ...contextConfig.styles?.root, ...styles.root }}
    >
      {renderHeader()}
      {renderContent()}
    </div>
  );
});

export default Mermaid;
