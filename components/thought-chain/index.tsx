import React from 'react';
import { Avatar, Typography } from 'antd';
import classnames from 'classnames';

import pickAttrs from 'rc-util/lib/pickAttrs';

import useMergedState from 'rc-util/lib/hooks/useMergedState';
import useConfigContext from '../config-provider/useConfigContext';
import useStyle from './style';

import type { THOUGHT_CHAIN_ITEM_STATUS } from './style';

interface ThoughtChainItem {
  /**
   * @desc 思维节点唯一标识符
   * @descEN Unique identifier
   */
  key: string;

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
}

export interface ThoughtChainProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * @desc 思维节点集合
   * @descEN chain items
   */
  items?: ThoughtChainItem[];

  /**
   * @desc 当前展开的节点
   * @descEN current expanded keys
   */
  expandedKeys?: string[];

  /**
   * @desc 展开节点变化回调
   * @descEN callback when expanded keys change
   */
  onExpand?: (expandedKeys: string[]) => void;

  /**
   * @desc 自定义前缀
   * @descEN Prefix
   */
  prefixCls?: string;

  /**
   * @desc 自定义根类名
   * @descEN Custom class name
   */
  rootClassName?: string;

  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<'item' | 'itemHeader' | 'itemContent', React.CSSProperties>>;

  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<'item' | 'itemHeader' | 'itemContent', string>>;
}

const ThoughtChain: React.FC<ThoughtChainProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    items,
    onExpand,
    styles = {},
    classNames = {},
    expandedKeys,
    ...restProps
  } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  // ============================ ExpandedKeys ============================
  const [mergedExpandedKey, setMergedExpandedKey] = useMergedState<
    ThoughtChainProps['expandedKeys']
  >([], {
    value: expandedKeys,
  });

  // ============================ Prefix ============================
  const { getPrefixCls, direction } = useConfigContext();

  const prefixCls = getPrefixCls('thought-chain', customizePrefixCls);

  // ============================ Style ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(className, rootClassName, prefixCls, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  return wrapCSSVar(
    <div {...domProps} className={mergedCls}>
      {items?.map((item, index) => {
        const { key, icon, title, description, extra, status = 'default', content, footer } = item;
        const { status: nextItemStatus = 'default' } = items[index + 1] || {};

        return (
          <div
            key={key}
            className={classnames(
              `${prefixCls}-item`,
              `${prefixCls}-item-${status}${nextItemStatus ? `-${nextItemStatus}` : ''}`,
              { [`${prefixCls}-item-collapsible`]: React.isValidElement(content) },
              classNames.item,
            )}
            style={styles.item}
          >
            {/* Header */}
            <div
              className={classnames(`${prefixCls}-item-header`, classNames.itemHeader)}
              style={styles.itemHeader}
            >
              {icon && <Avatar icon={icon} className={`${prefixCls}-item-icon`} />}
              {title && (
                <Typography.Text
                  className={`${prefixCls}-item-title`}
                  strong
                  ellipsis={{ tooltip: true }}
                >
                  {title}
                </Typography.Text>
              )}
              {description && (
                <Typography.Text
                  className={`${prefixCls}-item-desc`}
                  type="secondary"
                  ellipsis={{ tooltip: true }}
                >
                  {description}
                </Typography.Text>
              )}
              {extra && <div className={`${prefixCls}-item-extra`}>{extra}</div>}
            </div>
            {/* Content */}
            {content && (
              <div
                className={classnames(`${prefixCls}-item-content`, classNames.itemContent)}
                style={styles.itemContent}
              >
                <div className={`${prefixCls}-item-content-box`}>{content}</div>
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
      })}
    </div>,
  );
};

export default ThoughtChain;
