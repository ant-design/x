import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import Status, { THOUGHT_CHAIN_ITEM_STATUS } from './Status';
import useStyle from './style';

enum VARIANT {
  SOLID = 'solid',
  OUTLINED = 'outlined',
  TEXT = 'text',
}
export interface ThoughtChainItemProp
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'content'> {
  /**
   * @desc 思维节点唯一标识符
   * @descEN Unique identifier
   */
  key?: string;

  /**
   * @desc 自定义前缀
   * @descEN Prefix
   */
  prefixCls?: string;

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
   * @desc 根节点样式类
   * @descEN Root node style class.
   */
  rootClassName?: string;

  /**
   * @desc 思维节点状态
   * @descEN Thought chain item status
   */
  status?: `${THOUGHT_CHAIN_ITEM_STATUS}`;
  /**
   * @desc 思维节点变体
   * @descEN Thought chain item variant
   */
  variant?: `${VARIANT}`;
}

const Item: React.FC<ThoughtChainItemProp> = (props) => {
  // ============================ Info ============================
  const {
    key,
    variant = 'solid',
    prefixCls: customizePrefixCls,
    rootClassName,
    title,
    icon,
    status,
    onClick,
    description,
    ...restProps
  } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  const id = React.useId();

  // ============================ Prefix ============================

  const { getPrefixCls, direction } = useXProviderContext();

  const prefixCls = getPrefixCls('thought-chain', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const itemCls = `${prefixCls}-item`;

  // ============================ Render ============================
  return (
    <div
      key={key || id}
      onClick={onClick}
      {...domProps}
      className={classnames(prefixCls, hashId, cssVarCls, rootClassName, itemCls, {
        [`${itemCls}-${variant}`]: variant,
        [`${itemCls}-click`]: onClick,
        [`${itemCls}-error`]: status === THOUGHT_CHAIN_ITEM_STATUS.ERROR,
        [`${itemCls}-rtl`]: direction === 'rtl',
      })}
    >
      {(status || icon) && <Status prefixCls={prefixCls} icon={icon} status={status} />}
      <div className={classnames(`${itemCls}-content`)}>
        {title && <div className={classnames(`${itemCls}-title`)}>{title}</div>}
        {description && <div className={classnames(`${itemCls}-description`)}>{description}</div>}
      </div>
    </div>
  );
};

export default Item;
