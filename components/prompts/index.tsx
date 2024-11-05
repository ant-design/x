import { Button, Typography } from 'antd';
import classnames from 'classnames';
import React from 'react';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';

import useStyle from './style';

import type { PromptProps } from './interface';

export type SemanticType = 'list' | 'item' | 'itemContent' | 'title';

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
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    prefixCls,
    contextConfig.className,
    className,
    rootClassName,
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
  return wrapCSSVar(
    <div {...htmlProps} className={mergedCls} style={{ ...style, ...contextConfig.style }}>
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
        {items?.map((info, index) => (
          <Button
            key={info.key || `key_${index}`}
            type={info.disabled ? 'default' : 'text'}
            style={{ ...contextConfig.styles.item, ...styles.item }}
            disabled={info.disabled}
            className={classnames(
              `${prefixCls}-item`,
              contextConfig.classNames.item,
              classNames.item,
              {
                [`${prefixCls}-item-disabled`]: info.disabled,
              },
            )}
            onClick={() => onItemClick?.({ data: info })}
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
            </div>
          </Button>
        ))}
      </div>
    </div>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Prompts.displayName = 'Prompts';
}

export type { PromptProps };

export default Prompts;
