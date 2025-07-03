import type { MenuItemProps, MenuProps } from 'antd';
import type { ReactNode } from 'react';

export interface SubItemType extends Pick<MenuItemProps, 'danger'> {
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
  icon?: ReactNode;
  /**
   * @desc 点击自定义操作按钮时的回调函数
   * @descEN Callback function when the custom action button is clicked.
   */
  onItemClick?: (info?: ActionItem) => void;
}

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
  icon?: ReactNode;
  /**
   * @desc 点击自定义操作按钮时的回调函数
   * @descEN Callback function when the custom action button is clicked.
   */
  onItemClick?: (info?: ActionItem) => void;
  /**
   * @desc 子操作项
   * @descEN Child action items.
   */
  subItems?: ActionItem[];
  /**
   * @desc 子菜单的触发方式
   * @descEN Trigger mode of sub menu.
   */
  triggerSubMenuAction?: MenuProps['triggerSubMenuAction'];
}
export type ActionItem = SubItemType | ItemType;
