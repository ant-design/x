import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { ConfigProviderProps, GetProp } from 'antd';
import classnames from 'classnames';
import type { CSSMotionProps } from 'rc-motion';
import CSSMotion from 'rc-motion';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';
import type { ThoughtChainItem, ThoughtChainProps } from './interface';
import Status from './Status';

// ================= ThoughtChainContext ====================

export const ThoughtChainContext = React.createContext<{
  prefixCls?: string;
  expandedKeys?: string[];
  collapseMotion?: CSSMotionProps;
  onItemExpand?: (curKey: string) => void;
  direction?: GetProp<ConfigProviderProps, 'direction'>;
  styles?: ThoughtChainProps['styles'];
  classNames?: ThoughtChainProps['classNames'];
}>(null!);

interface ThoughtChainNodeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  info?: ThoughtChainItem;
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
    direction,
    collapseMotion,
    onItemExpand,
    classNames = {},
    styles = {},
  } = React.useContext(ThoughtChainContext) || {};

  const { collapsible, key = id, icon, title, content, footer, status, description } = info;

  // ============================ Style ============================
  const nodeCls = `${prefixCls}-node`;

  // ============================ Content Open ============================
  const contentOpen = expandedKeys?.includes(key);

  const iconNode = icon ? (
    icon
  ) : (
    <div className={classnames(`${nodeCls}-index-icon`)}>{index + 1}</div>
  );
  // ============================ Render ============================
  return (
    <div
      {...domProps}
      className={classnames(nodeCls, className, classNames.item)}
      style={props.style}
    >
      <Status
        className={classnames(`${nodeCls}-icon`, classNames.itemIcon, {
          [`${nodeCls}-icon-${line}`]: typeof line !== 'boolean',
        })}
        style={styles.itemIcon}
        prefixCls={prefixCls}
        icon={iconNode}
        status={status}
      />
      <div className={classnames(`${nodeCls}-box`)}>
        {/* Header */}
        <div
          className={classnames(`${nodeCls}-header`, classNames.itemHeader)}
          style={styles.itemHeader}
        >
          {/* Header */}
          <div className={classnames(`${nodeCls}-title`)} onClick={() => onItemExpand?.(key)}>
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
                className={classnames(`${nodeCls}-content`, motionClassName)}
                ref={motionRef}
                style={style}
              >
                <div
                  className={classnames(`${nodeCls}-content-box`, classNames.itemContent)}
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
            className={classnames(`${nodeCls}-footer`, classNames.itemFooter)}
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
