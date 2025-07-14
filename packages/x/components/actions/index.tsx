import type { DropdownProps } from 'antd';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import ActionsFeedback from './ActionsFeedback';
import Item, { ActionItemType } from './Item';

import useStyle from './style';

export const ActionsContext = React.createContext<{
  prefixCls?: string;
  styles?: ActionsProps['styles'];
  classNames?: ActionsProps['classNames'];
}>(null!);

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

const ForwardActions: React.FC<ActionsProps> = (props) => {
  const {
    items = [],
    onClick,
    footer,
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
  const [hashId, cssVarCls] = useStyle(prefixCls);

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

  return (
    <div {...domProps} className={mergedCls} style={mergedStyle}>
      <ActionsContext.Provider
        value={{
          prefixCls,
          classNames: {
            item: classnames(contextConfig.classNames.item, classNames.item),
            itemDropdown: classnames(
              contextConfig.classNames.itemDropdown,
              classNames.itemDropdown,
            ),
          },
          styles: {
            item: { ...contextConfig.styles.item, ...styles.item },
            itemDropdown: { ...contextConfig.styles.itemDropdown, ...styles.itemDropdown },
          },
        }}
      >
        <div className={classnames(`${prefixCls}-list`, variant)}>
          {items.map((item, idx) => {
            return <Item item={item} onClick={onClick} dropdownProps={dropdownProps} key={idx} />;
          })}
        </div>

        {footer && (
          <div className={classNames.footer} style={styles.footer}>
            {footer}
          </div>
        )}
      </ActionsContext.Provider>
    </div>
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
