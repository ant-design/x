import type { DropdownProps, MenuItemProps, MenuProps } from 'antd';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import ActionsFeedback from './ActionsFeedback';
import Item from './Item';

import useStyle from './style';

export type SemanticType = 'root' | 'item' | 'itemDropdown';

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

export interface SubItemType extends Omit<ItemType, 'subItems' | 'triggerSubMenuAction'> {
  danger: MenuItemProps['danger'];
}

export type ActionItem = ItemType | SubItemType;

export interface ActionsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'popupRender'> {
  /**
   * @desc 包含多个操作项的列表
   * @descEN A list containing multiple action items.
   */
  items: (ActionItem | React.ReactNode)[];
  /**
   * @desc 组件被点击时的回调函数。
   * @descEN Callback function when component is clicked.
   */
  onClick?: (menuInfo: {
    item: ActionItem;
    key: string;
    keyPath: string[];
    domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  }) => void;
  /**
   * @desc 底部额外的React节点内容
   * @descEN Additional React node content at the bottom.
   */
  popupRender?: React.ReactNode;
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

const ForwardActions: React.FC<ActionsProps> = (props) => {
  const {
    items = [],
    onClick,
    popupRender,
    dropdownProps = {},
    variant = 'borderless',

    prefixCls: customizePrefixCls,
    classNames = {},
    rootClassName = '',
    className = '',
    styles = {},
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
    contextConfig.classNames.root,
    rootClassName,
    className,
    classNames.root,
    cssVarCls,
    hashId,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );
  const mergedStyle = {
    ...contextConfig.style,
    ...styles.root,
    ...style,
  };

  return wrapCSSVar(
    <div className={mergedCls} {...domProps} style={mergedStyle}>
      <div className={classnames(`${prefixCls}-list`, variant)}>
        {items.map((item, idx) => {
          return (
            <Item
              item={item as ItemType}
              onClick={onClick}
              prefixCls={prefixCls}
              classNames={classNames}
              styles={styles}
              className={classnames(`${prefixCls}-list-item`, classNames.item)}
              style={styles.item}
              dropdownProps={dropdownProps}
              key={idx}
            />
          );
        })}
      </div>
      {popupRender}
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
