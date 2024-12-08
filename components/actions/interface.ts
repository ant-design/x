import type { MenuItemProps, MenuProps } from 'antd';
import type { ReactNode } from 'react';

export interface ActionsProps {
  /**
   * @desc 包含多个操作项的列表
   * @descEN A list containing multiple action items.
   */
  items: ActionItemType[];
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
    item: ActionItemType;
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
   * @default 'border'
   */
  variant?: 'borderless' | 'border';
  /**
   * @desc 样式类名的前缀。
   * @descEN Prefix for style class names.
   */
  prefixCls?: string;
}

export interface ItemType extends Pick<MenuItemProps, 'danger'> {
  /**
   * @desc 自定义操作的显示标签
   * @descEN Display label for the custom action.
   */
  label?: string;
  /**
   * @desc 自定义操作的唯一标识
   * @descEN Unique identifier for the custom action.
   */
  key: string;
  /**
   * @desc 自定义操作的图标
   * @descEN Icon for the custom action.
   */
  icon?: ReactNode;
  /**
   * @desc 点击自定义操作按钮时的回调函数
   * @descEN Callback function when the custom action button is clicked.
   */
  onClick?: () => void;
}

export interface SubItemType {
  /**
   * @desc 自定义操作的唯一标识
   * @descEN Unique identifier for the custom action.
   */
  key: string;
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
   * @desc 子操作项
   * @descEN Child action items.
   */
  children?: ActionItemType[];
  triggerSubMenuAction?: MenuProps['triggerSubMenuAction'];
  /**
   * @desc 点击自定义操作按钮时的回调函数
   * @descEN Callback function when the custom action button is clicked.
   */
  onClick?: () => void;
}
export type ActionItemType = ItemType | SubItemType;
