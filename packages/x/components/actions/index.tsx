import React from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import ActionsMenu from './ActionsMenu';
import ActionsFeedback from './ActionsFeedback';
import type { ActionItem, ItemType } from './interface';

import useStyle from './style';

export interface ActionsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * @desc 包含多个操作项的列表
   * @descEN A list containing multiple action items.
   */
  items: (ActionItem | React.ReactNode)[];
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
  /**
   * @desc 根节点样式类
   * @descEN Root node style class.
   */
  rootClassName?: string;
  /**
   * @desc 根节点样式
   * @descEN Style for the root node.
   */
  style?: React.CSSProperties;
}

const ForwardActions: React.FC<ActionsProps> = (props: ActionsProps) => {
  const {
    items = [],
    onClick,
    variant = 'borderless',
    prefixCls: customizePrefixCls,
    rootClassName = {},
    style = {},
    ...otherHtmlProps
  } = props;

  const domProps = pickAttrs(otherHtmlProps, {
    attr: true,
    aria: true,
    data: true,
  });

  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('actions', customizePrefixCls);
  const contextConfig = useXComponentConfig('actions');
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

  return wrapCSSVar(
    <div className={mergedCls} {...domProps} style={mergedStyle}>
      <div className={classnames(`${prefixCls}-list`, variant)}>
        {items.map((item) => {
          const itemObj = item as ItemType;
          const id = React.useId();
          const itemKey = itemObj?.key || id;

          if (itemObj === null) {
            return null;
          }

          if (React.isValidElement(itemObj)) {
            return React.cloneElement(itemObj, {
              key: itemKey,
            });
          }

          if ('subItems' in itemObj) {
            return (
              <ActionsMenu key={itemKey} item={itemObj} prefixCls={prefixCls} onClick={onClick} />
            );
          }

          return (
            <div
              className={classnames(`${prefixCls}-list-item`)}
              onClick={(domEvent) => {
                if (itemObj?.onItemClick) {
                  itemObj.onItemClick(itemObj);
                  return;
                }
                onClick?.({
                  key: itemKey,
                  item: itemObj,
                  keyPath: [itemKey],
                  domEvent,
                });
              }}
              key={itemKey}
            >
              <Tooltip title={itemObj.label}>
                <div className={`${prefixCls}-list-item-icon`}>{itemObj?.icon}</div>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>,
  );
};

type CompoundedActions = typeof ForwardActions & {
  Feedback: typeof ActionsFeedback;
};

const Actions = ForwardActions as CompoundedActions;

if (process.env.NODE_ENV !== 'production') {
  Actions.displayName = 'Actions';
}

Actions.Feedback = ActionsFeedback;

export default Actions;
