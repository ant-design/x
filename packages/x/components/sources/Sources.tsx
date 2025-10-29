import { RightOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import classnames from 'classnames';
import type { CSSMotionProps } from 'rc-motion';
import CSSMotion from 'rc-motion';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import initCollapseMotion from '../_util/motion';
import { useXProviderContext } from '../x-provider';
import CarouselCard from './components/CarouselCard';
import useStyle from './style';

export type SemanticType = 'root' | 'title' | 'content';

export interface SourcesItem {
  key?: React.Key;
  title: React.ReactNode;
  url?: string;
  icon?: React.ReactNode;
  description?: React.ReactNode;
}

export interface SourcesProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'onClick'> {
  prefixCls?: string;
  style?: React.CSSProperties;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  className?: string;
  classNames?: Partial<Record<SemanticType, string>>;
  rootClassName?: string;
  inline?: boolean;
  items?: Array<SourcesItem>;
  title?: React.ReactNode;
  expandIconPosition?: 'start' | 'end';
  onClick?: (item: SourcesItem) => void;
  popoverOverlayWidth?: number | string;
  activeKey?: React.Key;
  expanded?: boolean;
  onExpand?: (expand: boolean) => void;
  defaultExpanded?: boolean;
}

type SourcesRef = {
  nativeElement: HTMLElement;
};

const Sources: React.ForwardRefRenderFunction<SourcesRef, SourcesProps> = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    style,
    styles = {},
    className,
    rootClassName,
    classNames = {},
    title,
    expandIconPosition = 'start',
    children,
    inline = false,
    expanded,
    defaultExpanded,
    onExpand,
    activeKey,
    items,
    popoverOverlayWidth = 300,
    ...restProps
  } = props;

  // ============================ Prefix ============================

  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('sources', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);

  // ======================= Component Config =======================

  const contextConfig = useXComponentConfig('sources');
  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  // ============================= Refs =============================
  const sourcesRef = React.useRef<HTMLDivElement>(null);
  useProxyImperativeHandle(ref, () => {
    return {
      nativeElement: sourcesRef.current!,
    };
  });

  const mergedCls = classnames(
    prefixCls,
    contextConfig.className,
    className,
    rootClassName,
    classNames.root,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-inline`]: inline,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );

  // ============================  Collapsible ============================

  const [isExpand, setIsExpand] = useMergedState<boolean>(defaultExpanded ?? true, {
    value: expanded,
    onChange: onExpand,
  });

  const collapseMotion: CSSMotionProps = {
    ...initCollapseMotion(),
    motionAppear: false,
    leavedClassName: `${prefixCls}-content-hidden`,
  };

  const ContentNode = items ? (
    <ul className={`${prefixCls}-list`}>
      {items.map((item, index) => (
        <li
          key={item.key || index}
          className={`${prefixCls}-list-item`}
          onClick={() => props.onClick?.(item)}
        >
          <a
            className={`${prefixCls}-link`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.icon && <span className={`${prefixCls}-link-icon`}>{item.icon}</span>}
            <span className={`${prefixCls}-link-title`}>{item.title}</span>
          </a>
        </li>
      ))}
    </ul>
  ) : (
    children
  );

  return (
    <div
      ref={sourcesRef}
      {...domProps}
      className={mergedCls}
      style={{
        ...contextConfig.style,
        ...contextConfig.styles.root,
        ...style,
        ...styles.root,
      }}
    >
      {inline ? (
        <Popover
          content={
            <CarouselCard
              className={classNames.content}
              style={styles.content}
              activeKey={activeKey}
              prefixCls={prefixCls}
              items={items}
              onClick={props.onClick}
            />
          }
          open={inline ? undefined : false}
          styles={{ body: { width: popoverOverlayWidth } }}
          placement="top"
          forceRender
        >
          <div
            className={classnames(`${prefixCls}-title-wrapper`, classNames.title)}
            style={styles.title}
          >
            <span className={`${prefixCls}-title`}>{title}</span>
          </div>
        </Popover>
      ) : (
        <>
          <div
            className={classnames(
              `${prefixCls}-title-wrapper`,
              `${prefixCls}-icon-position-${expandIconPosition}`,
              classNames.title,
            )}
            onClick={() => setIsExpand(!isExpand)}
            style={styles.title}
          >
            <RightOutlined className={`${prefixCls}-title-down-icon`} rotate={isExpand ? 90 : 0} />
            <span className={`${prefixCls}-title`}>{title}</span>
          </div>
          <CSSMotion {...collapseMotion} visible={isExpand}>
            {({ className: motionClassName, style }, motionRef) => (
              <div
                className={classnames(`${prefixCls}-content`, motionClassName, classNames.content)}
                ref={motionRef}
                style={{ ...style, ...styles.content }}
              >
                {ContentNode}
              </div>
            )}
          </CSSMotion>
        </>
      )}
    </div>
  );
};

const ForwardSources = React.forwardRef(Sources);

if (process.env.NODE_ENV !== 'production') {
  ForwardSources.displayName = 'Sources';
}

export default ForwardSources;
