import { Typography } from 'antd';
import classnames from 'classnames';
import React from 'react';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';

import useStyle from './style';

export interface BasePromptItem {
  /**
   * @desc 唯一标识用于区分每个提示项。
   * @descEN Unique identifier used to distinguish each prompt item.
   */
  key: string;

  /**
   * @desc 提示图标显示在提示项的左侧。
   * @descEN Prompt icon displayed on the left side of the prompt item.
   */
  icon?: React.ReactNode;

  /**
   * @desc 提示标签显示提示的主要内容。
   * @descEN Prompt label displaying the main content of the prompt.
   */
  label?: React.ReactNode;

  /**
   * @desc 提示描述提供额外的信息。
   * @descEN Prompt description providing additional information.
   */
  description?: React.ReactNode;

  /**
   * @desc 设置为 true 时禁用点击事件。
   * @descEN When set to true, click events are disabled.
   */
  disabled?: boolean;
}

export interface PromptProps extends BasePromptItem {
  children?: BasePromptItem[];
}

export type SemanticType =
  | 'root'
  | 'list'
  | 'item'
  | 'itemContent'
  | 'title'
  | 'subList'
  | 'subItem';

export interface PromptsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'title'> {
  /**
   * @desc 包含多个提示项的列表。
   * @descEN List containing multiple prompt items.
   */
  items?: PromptProps[];

  /**
   * @desc 显示在提示列表顶部的标题。
   * @descEN Title displayed at the top of the prompt list.
   */
  title?: React.ReactNode;

  /**
   * @desc Item 提示项被点击时的回调函数。
   * @descEN Callback function when a prompt item is clicked.
   */
  onItemClick?: (info: { data: PromptProps }) => void;

  /**
   * @desc 提示列表是否垂直排列。
   * @descEN Whether the prompt list is arranged vertically.
   */
  vertical?: boolean;

  /**
   * @desc 提示列表是否换行。
   * @descEN Whether the prompt list is wrapped.
   */
  wrap?: boolean;

  /**
   * @desc 自定义样式，用于各个提示项的不同部分。
   * @descEN Custom styles for different parts of each prompt item.
   */
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;

  /**
   * @desc 自定义样式类名，用于各个提示项的不同部分。
   * @descEN Custom style class names for different parts of each prompt item.
   */
  classNames?: Partial<Record<SemanticType, string>>;

  /**
   * @desc 样式类名的前缀。
   * @descEN Prefix for style class names.
   */
  prefixCls?: string;

  /**
   * @desc 根节点的样式类名。
   * @descEN Style class name for the root node.
   */
  rootClassName?: string;
}

const Prompts: React.FC<PromptsProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    title,
    className,
    items,
    onItemClick,
    vertical,
    wrap,
    rootClassName,
    styles = {},
    classNames = {},
    style,
    ...htmlProps
  } = props;

  // ============================ PrefixCls ============================
  const { getPrefixCls, direction } = useXProviderContext();

  const prefixCls = getPrefixCls('prompts', customizePrefixCls);

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('prompts');

  // ============================ Style ============================
  const [hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    prefixCls,
    contextConfig.className,
    className,
    rootClassName,
    classNames.root,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );

  const mergedListCls = classnames(
    `${prefixCls}-list`,
    contextConfig.classNames.list,
    classNames.list,
    { [`${prefixCls}-list-wrap`]: wrap },
    { [`${prefixCls}-list-vertical`]: vertical },
  );

  // ============================ Render ============================
  return (
    <div
      {...htmlProps}
      className={mergedCls}
      style={{ ...style, ...contextConfig.style, ...styles.root }}
    >
      {/* Title */}
      {title && (
        <Typography.Title
          level={5}
          className={classnames(
            `${prefixCls}-title`,
            contextConfig.classNames.title,
            classNames.title,
          )}
          style={{ ...contextConfig.styles.title, ...styles.title }}
        >
          {title}
        </Typography.Title>
      )}
      {/* Prompt List */}
      <div className={mergedListCls} style={{ ...contextConfig.styles.list, ...styles.list }}>
        {items?.map((info, index) => {
          const isNest = info.children && info.children.length > 0;

          return (
            <div
              key={info.key || `key_${index}`}
              style={{ ...contextConfig.styles.item, ...styles.item }}
              className={classnames(
                `${prefixCls}-item`,
                contextConfig.classNames.item,
                classNames.item,
                {
                  [`${prefixCls}-item-disabled`]: info.disabled,
                  [`${prefixCls}-item-has-nest`]: isNest,
                },
              )}
              onClick={() => {
                if (!isNest && onItemClick) {
                  onItemClick({ data: info });
                }
              }}
            >
              {/* Icon */}
              {info.icon && <div className={`${prefixCls}-icon`}>{info.icon}</div>}
              {/* Content */}
              <div
                className={classnames(
                  `${prefixCls}-content`,
                  contextConfig.classNames.itemContent,
                  classNames.itemContent,
                )}
                style={{ ...contextConfig.styles.itemContent, ...styles.itemContent }}
              >
                {/* Label */}
                {info.label && <h6 className={`${prefixCls}-label`}>{info.label}</h6>}

                {/* Description */}
                {info.description && <p className={`${prefixCls}-desc`}>{info.description}</p>}

                {/* Children */}
                {isNest && (
                  <Prompts
                    className={`${prefixCls}-nested`}
                    items={info.children}
                    vertical
                    onItemClick={onItemClick}
                    classNames={{
                      list: classNames.subList,
                      item: classNames.subItem,
                    }}
                    styles={{
                      list: styles.subList,
                      item: styles.subItem,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Prompts.displayName = 'Prompts';
}

export default Prompts;
