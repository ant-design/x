import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { CSSMotionProps } from '@rc-component/motion';
import CSSMotion from '@rc-component/motion';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import { clsx } from 'clsx';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import type { ThoughtChainItemType, ThoughtChainProps } from './interface';
import Status from './Status';

// ================= ThoughtChainContext ====================

export const ThoughtChainContext = React.createContext<{
  prefixCls?: string;
  expandedKeys?: string[];
  collapseMotion?: CSSMotionProps;
  onItemExpand?: (curKey: string) => void;
  styles?: ThoughtChainProps['styles'];
  classNames?: ThoughtChainProps['classNames'];
}>(null!);

interface ThoughtChainNodeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  info?: ThoughtChainItemType;
  line?: ThoughtChainProps['line'];
  index: number;
}

const ThoughtChainNode: React.FC<ThoughtChainNodeProps> = (props) => {
  // ================= info ====================
  const id = React.useId();
  const { info = {}, line, index, className, ...restProps } = props;
  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  const {
    prefixCls,
    expandedKeys,
    collapseMotion,
    onItemExpand,
    classNames = {},
    styles = {},
  } = React.useContext(ThoughtChainContext) || {};

  const { direction } = useXProviderContext();

  const { collapsible, key = id, icon, blink, title, content, footer, status, description } = info;

  // ============================ Style ============================
  const nodeCls = `${prefixCls}-node`;

  // ============================ Content Open ============================
  const contentOpen = expandedKeys?.includes(key);
  let iconNode: React.ReactNode = <div className={clsx(`${nodeCls}-index-icon`)}>{index + 1}</div>;

  iconNode = icon === false ? null : icon || iconNode;

  // ============================ Render ============================
  return (
    <div {...domProps} className={clsx(nodeCls, className, classNames.item)} style={props.style}>
      {iconNode && (
        <Status
          className={clsx(`${nodeCls}-icon`, classNames.itemIcon, {
            [`${nodeCls}-icon-${line}`]: typeof line !== 'boolean',
          })}
          style={styles.itemIcon}
          prefixCls={prefixCls}
          icon={iconNode}
          status={status}
        />
      )}
      <div className={clsx(`${nodeCls}-box`)}>
        {/* Header */}
        <div className={clsx(`${nodeCls}-header`, classNames.itemHeader)} style={styles.itemHeader}>
          {/* Header */}
          <div
            className={clsx(`${nodeCls}-title`, {
              [`${nodeCls}-collapsible`]: collapsible,
              [`${prefixCls}-motion-blink`]: blink,
            })}
            onClick={collapsible ? () => onItemExpand?.(key) : undefined}
          >
            {title}
            {collapsible &&
              content &&
              (direction === 'rtl' ? (
                <LeftOutlined
                  className={`${nodeCls}-collapse-icon`}
                  rotate={contentOpen ? -90 : 0}
                />
              ) : (
                <RightOutlined
                  className={`${nodeCls}-collapse-icon`}
                  rotate={contentOpen ? 90 : 0}
                />
              ))}
          </div>
          {description && <div className={`${nodeCls}-description`}>{description}</div>}
        </div>
        {/* Content */}
        {content && (
          <CSSMotion {...collapseMotion} visible={collapsible ? contentOpen : true}>
            {({ className: motionClassName, style }, motionRef) => (
              <div
                className={clsx(`${nodeCls}-content`, motionClassName)}
                ref={motionRef}
                style={style}
              >
                <div
                  className={clsx(`${nodeCls}-content-box`, classNames.itemContent)}
                  style={styles.itemContent}
                >
                  {content}
                </div>
              </div>
            )}
          </CSSMotion>
        )}
        {/* Footer */}
        {footer && (
          <div
            className={clsx(`${nodeCls}-footer`, classNames.itemFooter)}
            style={styles.itemFooter}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThoughtChainNode;
