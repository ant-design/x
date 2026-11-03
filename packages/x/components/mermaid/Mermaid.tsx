import { DownloadOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, Segmented, Tooltip } from 'antd';
import { clsx } from 'clsx';
import throttle from 'lodash.throttle';
import mermaid, { type MermaidConfig } from 'mermaid';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import warning from '../_util/warning';
import Actions from '../actions';
import type { ItemType } from '../actions/interface';
import CodeHighlighter from '../code-highlighter';
import type { CodeHighlighterProps } from '../code-highlighter/interface';
import locale_EN from '../locale/en_US';
import useLocale from '../locale/useLocale';
import { useXProviderContext } from '../x-provider';
import useStyle from './style';

export type MermaidType = 'root' | 'header' | 'graph' | 'code';

export interface MermaidProps {
  children: string;
  header?: React.ReactNode | null;
  prefixCls?: string;
  style?: React.CSSProperties;
  className?: string;
  highlightProps?: CodeHighlighterProps['highlightProps'];
  config?: MermaidConfig;
  actions?: {
    enableZoom?: boolean;
    enableDownload?: boolean;
    enableCopy?: boolean;
    customActions?: ItemType[];
  };
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
    config,
    actions = {},
    onRenderTypeChange,
  } = props;
  const [renderType, setRenderType] = useState(RenderType.Image);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  // 始终保存下一次（可能被节流延后的）渲染要使用的入参
  const latestRef = useRef({ children, renderType });
  // 每发起一次渲染自增，用于丢弃已过期的渲染结果
  const requestRef = useRef(0);

  // ============================ locale ============================
  const [contextLocale] = useLocale('Mermaid', locale_EN.Mermaid);

  // ============================ Prefix ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('mermaid', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('mermaid');

  // ============================ style ============================
  const mergedCls = clsx(
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

  // ============================ initialize mermaid ============================
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'default',
      fontFamily: 'monospace',
      // `mermaid.render(id, text)` below is called without a container element, so mermaid
      // mounts its temporary `div#d{id}` on `document.body`. With error rendering enabled
      // (mermaid's default) a failed render draws the "Syntax error in text" bomb diagram
      // into that element and *then* throws, so mermaid's own `removeTempElements()` never
      // runs — leaving the error SVG behind in `document.body`, outside this component and
      // outside any layout, once per failure. Suppressing it makes both failure branches
      // clean up after themselves instead.
      suppressErrorRendering: true,
      ...(config || {}),
    });
  }, [config]);

  // ============================ render mermaid ============================
  // 节流函数只创建一次，否则每次渲染都会新建实例，节流实际上不会生效。
  // 最新的入参通过 latestRef 读取。
  const renderDiagram = useMemo(
    () =>
      throttle(async () => {
        const { children: code, renderType: type } = latestRef.current;
        if (!code || !containerRef.current || type === RenderType.Code) return;

        requestRef.current += 1;
        const requestId = requestRef.current;
        // 每次渲染都使用独立的 id：mermaid 通过 `[id="..."]` 在整个 document 中查找
        // 渲染目标，复用 id 会让它画进我们已经插入的 SVG 里，返回的却是空图，导致图表空白。
        uuid += 1;
        const id = `mermaid-${uuid}`;

        try {
          const isValid = await mermaid.parse(code, { suppressErrors: true });
          if (!isValid) throw new Error('Invalid Mermaid syntax');

          const { svg } = await mermaid.render(id, code);
          // 丢弃已被新请求取代的结果，避免旧内容覆盖最新图表
          if (requestId !== requestRef.current || !containerRef.current) return;
          containerRef.current.innerHTML = svg;
        } catch (error) {
          warning(false, 'Mermaid', `Render failed: ${error}`);
        }
      }, 100),
    [],
  );

  useEffect(() => {
    latestRef.current = { children, renderType };

    if (renderType === RenderType.Code) {
      // 清理图表内容，避免在代码视图下出现渲染错误
      renderDiagram.cancel();
      requestRef.current += 1;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    } else {
      renderDiagram();
    }
  }, [children, renderType, config, renderDiagram]);

  useEffect(
    () => () => {
      renderDiagram.cancel();
      requestRef.current += 1;
    },
    [renderDiagram],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || renderType !== RenderType.Image) return;

    const { enableZoom = true } = actions;
    if (!enableZoom) return;

    let lastTime = 0;
    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastTime < 16) return;
      lastTime = now;

      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.max(0.5, prev + delta));
    };

    container.addEventListener('wheel', wheelHandler, { passive: false });

    return () => {
      container.removeEventListener('wheel', wheelHandler);
    };
  }, [renderType, actions]);

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

    const exportSvg = svgElement.cloneNode(true) as SVGSVGElement;
    exportSvg.style.removeProperty('transform');
    exportSvg.style.removeProperty('transform-origin');
    exportSvg.style.removeProperty('transition');
    exportSvg.style.removeProperty('cursor');

    const viewBox = svgElement.viewBox.baseVal;
    let width = viewBox.width || svgElement.width.baseVal.value;
    let height = viewBox.height || svgElement.height.baseVal.value;
    if (!width || !height) {
      const bounds = svgElement.getBoundingClientRect();
      width ||= bounds.width / scale;
      height ||= bounds.height / scale;
    }
    if (!width || !height) return;

    exportSvg.setAttribute('width', `${width}`);
    exportSvg.setAttribute('height', `${height}`);

    const svgString = new XMLSerializer().serializeToString(exportSvg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
    setScale((prev) => prev + 0.2);
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const renderHeader = () => {
    if (header === null) return null;
    if (header) return header;

    const {
      enableZoom = true,
      enableDownload = true,
      enableCopy = true,
      customActions = [],
    } = actions;

    const items: ItemType[] = [];

    if (renderType === RenderType.Image) {
      if (enableZoom) {
        items.push(
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
        );
      }
      if (enableDownload) {
        items.push({
          key: 'download',
          icon: <DownloadOutlined />,
          label: contextLocale.download,
          onItemClick: handleDownload,
        });
      }
    } else {
      if (enableCopy) {
        items.push({
          key: 'copy',
          actionRender: () => <Actions.Copy text={children} />,
        });
      }
    }

    const allItems = [...items, ...customActions];

    return (
      <div
        className={clsx(
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
        <Actions items={allItems} />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <>
        <div
          className={clsx(
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
            className={clsx(`${prefixCls}-code`, contextConfig.classNames?.code, classNames?.code)}
            style={{ ...contextConfig.styles?.code, ...styles.code }}
          >
            <CodeHighlighter
              lang="mermaid"
              header={null}
              styles={{
                code: {
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 0,
                },
              }}
              highlightProps={{
                customStyle: {
                  padding: 0,
                  background: 'transparent',
                },
                ...highlightProps,
              }}
            >
              {children}
            </CodeHighlighter>
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
