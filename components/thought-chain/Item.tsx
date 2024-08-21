import React from 'react';
import classnames from 'classnames';
import { Avatar, Typography } from 'antd';
import CSSMotion from 'rc-motion';
import pickAttrs from 'rc-util/lib/pickAttrs';

import type { CSSMotionProps } from 'rc-motion';

export enum THOUGHT_CHAIN_ITEM_STATUS {
  /**
   * @desc 等待状态
   */
  PENDING = 'pending',
  /**
   * @desc 成功状态
   */
  SUCCESS = 'success',
  /**
   * @desc 错误状态
   */
  ERROR = 'error',
}

export interface ThoughtChainItem {
  /**
   * @desc 思维节点唯一标识符
   * @descEN Unique identifier
   */
  key?: string;

  /**
   * @desc 思维节点图标
   * @descEN Thought chain item icon
   */
  icon?: React.ReactNode;

  /**
   * @desc 思维节点标题
   * @descEN Thought chain item title
   */
  title?: React.ReactNode;

  /**
   * @desc 思维节点描述
   * @descEN Thought chain item description
   */
  description?: React.ReactNode;

  /**
   * @desc 思维节点额外内容
   * @descEN Thought chain item extra content
   */
  extra?: React.ReactNode;

  /**
   * @desc 思维节点内容
   * @descEN Thought chain item content
   */
  content?: React.ReactNode;

  /**
   * @desc 思维节点脚注
   * @descEN Thought chain item footer
   */
  footer?: React.ReactNode;

  /**
   * @desc 思维节点状态
   * @descEN Thought chain item status
   */
  status?: `${THOUGHT_CHAIN_ITEM_STATUS}`;

  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<'header' | 'content' | 'footer', React.CSSProperties>>;

  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<'header' | 'content' | 'footer', string>>;
}

export const ThoughtChainNodeContext = React.createContext<{
  prefixCls?: string;
  collapseMotion?: CSSMotionProps;
  enableCollapse?: boolean;
}>(null!);

interface ThoughtChainNodeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  info?: ThoughtChainItem;
  nextStatus?: ThoughtChainItem['status'];
  open?: boolean;
  onClick?: (key: string) => void;
}

const ThoughtChainNode: React.FC<ThoughtChainNodeProps> = (props) => {
  const { info = {}, nextStatus, open, onClick, ...restProps } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  // ================= ThoughtChainNodeContext ====================
  const { prefixCls, collapseMotion, enableCollapse } = React.useContext(ThoughtChainNodeContext);

  // ============================ Info ============================
  const id = React.useId();

  const {
    key = id,
    classNames = {},
    styles = {},
    icon,
    title,
    extra,
    content,
    footer,
    status,
    description,
  } = info;

  // ============================ Style ============================
  const contentBoxCls = `${prefixCls}-item-content-box`;

  // ============================ Event ============================
  const onThoughtChainNodeClick = () => onClick?.(key);

  // ============================ Render ============================
  return (
    <div
      {...domProps}
      className={classnames(
        `${prefixCls}-item`,
        {
          [`${prefixCls}-item-${status}${nextStatus ? `-${nextStatus}` : ''}`]: status,
        },
        { [`${prefixCls}-item-collapsible`]: enableCollapse },
        props.className,
      )}
      style={props.style}
    >
      {/* Header */}
      <div
        className={classnames(`${prefixCls}-item-header`, classNames.header)}
        style={styles.header}
        onClick={onThoughtChainNodeClick}
      >
        <Avatar icon={icon} className={`${prefixCls}-item-icon`} />
        {title && (
          <Typography.Text strong ellipsis className={`${prefixCls}-item-title`}>
            {title}
          </Typography.Text>
        )}
        {description && (
          <Typography.Text className={`${prefixCls}-item-desc`} ellipsis type="secondary">
            {description}
          </Typography.Text>
        )}
        {extra && <div className={`${prefixCls}-item-extra`}>{extra}</div>}
      </div>
      {/* Content */}
      {content && (
        <div className={`${prefixCls}-item-content`}>
          {enableCollapse ? (
            <CSSMotion {...collapseMotion} visible={open}>
              {({ className: motionClassName, style }, motionRef) => (
                <div
                  ref={motionRef}
                  style={style}
                  className={classnames(contentBoxCls, classNames.content, motionClassName)}
                >
                  {content}
                </div>
              )}
            </CSSMotion>
          ) : (
            <div className={classnames(contentBoxCls, classNames.content)}>{content}</div>
          )}
        </div>
      )}
      {/* Footer */}
      {footer && (
        <div className={`${prefixCls}-item-footer`}>
          <div className={`${prefixCls}-item-footer-box`}>{footer}</div>
        </div>
      )}
    </div>
  );
};

export default ThoughtChainNode;
