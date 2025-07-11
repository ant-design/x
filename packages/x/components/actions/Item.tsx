import { MenuProps, Tooltip } from 'antd';
import classnames from 'classnames';
import React from 'react';

import { ActionsContext, ActionsProps } from '.';
import ActionsMenu from './ActionsMenu';

export interface ItemType {
  /**
   * @desc 自定义操作的唯一标识
   * @descEN Unique identifier for the custom action.
   */
  key?: string;
  /**
   * @desc 自定义操作的显示标签
   * @descEN Display label for the custom action.
   */
  label?: string;
  /**
   * @desc 自定义操作的图标
   * @descEN Icon for the custom action.
   */
  icon?: React.ReactNode;
  /**
   * @desc 点击自定义操作按钮时的回调函数
   * @descEN Callback function when the custom action button is clicked.
   */
  onItemClick?: (info?: ActionItemType) => void;
  /**
   * @desc 自定义渲染操作项内容
   * @descEN Custom render action item content
   */
  actionRender?: (item: ActionItemType) => React.ReactNode;
  /**
   * @desc 子操作项
   * @descEN Child action items.
   */
  subItems?: SubItemType[];
  /**
   * @desc 子菜单的触发方式
   * @descEN Trigger mode of sub menu.
   */
  triggerSubMenuAction?: MenuProps['triggerSubMenuAction'];
  /**
   * @desc 危险状态
   * @descEN Danger status
   */
  danger?: boolean;
}

export interface SubItemType extends Omit<ItemType, 'subItems' | 'triggerSubMenuAction'> {}

export type ActionItemType = ItemType | SubItemType;

export interface ActionsItemProps extends Omit<ActionsProps, 'items' | 'variant'> {
  /**
   * @desc 组件中某一项
   * @descEN Component item
   */
  item: ItemType;
}

const Item: React.FC<ActionsItemProps> = (props) => {
  const { item, onClick, dropdownProps = {} } = props;
  const { prefixCls, classNames = {}, styles = {} } = React.useContext(ActionsContext) || {};

  const id = React.useId();
  const itemKey = item?.key || id;

  if (item === null) {
    return null;
  }

  if (item?.actionRender) {
    return item?.actionRender(item);
  }

  if ('subItems' in item) {
    return (
      <ActionsMenu key={itemKey} item={item} onClick={onClick} dropdownProps={dropdownProps} />
    );
  }

  return (
    <div
      className={classnames(`${prefixCls}-list-item`, classNames.item, {
        danger: item?.danger,
      })}
      style={styles.item}
      onClick={(domEvent) => {
        if (item?.onItemClick) {
          item.onItemClick(item);
          return;
        }
        onClick?.({
          key: itemKey,
          item: item,
          keyPath: [itemKey],
          domEvent,
        });
      }}
      key={itemKey}
    >
      <Tooltip title={item.label}>
        <div className={`${prefixCls}-list-item-icon`}>{item?.icon}</div>
      </Tooltip>
    </div>
  );
};

export default Item;
