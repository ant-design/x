import type { DropdownProps, MenuProps } from 'antd';
import type React from 'react';

export type SemanticType = 'root' | 'item' | 'itemDropdown' | 'footer';

export interface ActionsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'footer'> {
  /**
   * @desc 包含多个操作项的列表
   * @descEN A list containing multiple action items.
   */
  items: ActionItemType[];
  /**
   * @desc 组件被点击时的回调函数。
   * @descEN Callback function when component is clicked.
   */
  onClick?: (menuInfo: {
    item: ActionItemType;
    key: string;
    keyPath: string[];
    domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  }) => void;
  /**
   * @desc 底部额外的React节点内容
   * @descEN Additional React node content at the bottom.
   */
  footer?: React.ReactNode;
  /**
   * @desc 下拉菜单的配置属性
   * @descEN Configuration properties for dropdown menu
   */
  dropdownProps?: DropdownProps;
  /**
   * @desc 变体
   * @descEN Variant.
   * @default 'borderless'
   */
  variant?: 'borderless' | 'border';

  /**
   * @desc 样式类名的前缀。
   * @descEN Prefix for style classnames.
   */
  prefixCls?: string;
  /**
   * @desc 根节点样式类
   * @descEN Root node style class.
   */
  rootClassName?: string;
  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<SemanticType, string>>;
  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
}

export interface ActionsItemProps extends Omit<ActionsProps, 'items' | 'variant'> {
  item: ItemType;
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
