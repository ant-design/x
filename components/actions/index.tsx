import { Tooltip, type TooltipProps } from 'antd';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import ActionMenu from './ActionMenu';
import type { ActionItem, SubItemType } from './interface';

import useStyle from './style';

export interface ActionsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * @desc 包含多个操作项的列表
   * @descEN A list containing multiple action items.
   */
  items: ActionItem[];
  /**
   * @desc 根节点样式类
   * @descEN Root node style class.
   */
  rootClassName?: string;
  /**
   * @desc 子操作项是否占据一行
   * @descEN Whether the child action items occupy a line.
   * @default false
   */
  block?: boolean;
  /**
   * @desc Item 操作项被点击时的回调函数。
   * @descEN Callback function when an action item is clicked.
   */
  onClick?: (menuInfo: {
    item: ActionItem;
    key: string;
    keyPath: string[];
    domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  }) => void;
  /**
   * @desc 根节点样式
   * @descEN Style for the root node.
   */
  style?: React.CSSProperties;
  /**
   * @desc 变体
   * @descEN Variant.
   * @default 'borderless'
   */
  variant?: 'borderless' | 'border';
  /**
   * @desc 样式类名的前缀。
   * @descEN Prefix for style class names.
   */
  prefixCls?: string;
}

const Actions: React.FC<ActionsProps> = (props: ActionsProps) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName = {},
    style = {},
    variant = 'borderless',
    block = false,
    onClick,
    items = [],
    ...otherHtmlProps
  } = props;

  const domProps = pickAttrs(otherHtmlProps, {
    attr: true,
    aria: true,
    data: true,
  });

  // ============================ PrefixCls ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('actions', customizePrefixCls);

  // ======================= Component Config =======================
  const contextConfig = useXComponentConfig('actions');

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    prefixCls,
    contextConfig.className,
    rootClassName,
    cssVarCls,
    hashId,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );

  const mergedStyle = {
    ...contextConfig.style,
    ...style,
  };

  const getTooltipNode = (node: React.ReactNode, title?: string, tooltipProps?: TooltipProps) => {
    if (title) {
      return (
        <Tooltip {...tooltipProps} title={title}>
          {node}
        </Tooltip>
      );
    }
    return node;
  };

  const handleItemClick = (
    key: string,
    item: ActionItem,
    domEvent: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (item.onItemClick) {
      item.onItemClick(item);
      return;
    }
    onClick?.({
      key,
      item,
      keyPath: [key],
      domEvent,
    });
  };

  const renderSingleItem = (item: SubItemType) => {
    const { icon, label, key } = item;

    return (
      <div
        className={classnames(`${prefixCls}-list-item`)}
        onClick={(domEvent) => handleItemClick(key, item, domEvent)}
        key={key}
      >
        {getTooltipNode(<div className={`${prefixCls}-list-item-icon`}>{icon}</div>, label)}
      </div>
    );
  };

  return wrapCSSVar(
    <div className={mergedCls} {...domProps} style={mergedStyle}>
      <div className={classnames(`${prefixCls}-list`, variant, block)}>
        {items.map((item) => {
          if ('children' in item) {
            return (
              <ActionMenu key={item.key} item={item} prefixCls={prefixCls} onClick={onClick} />
            );
          }
          return renderSingleItem(item);
        })}
      </div>
    </div>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Actions.displayName = 'Actions';
}

export default Actions;
