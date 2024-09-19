import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';

import { useXConfig } from '../x-config-provider';
import useCollapsible from './hooks/useCollapsible';
import useStyle from './style';

import mergeStyles from '../_util/merge-styles';
import ThoughtChainNode, { ThoughtChainNodeContext } from './Item';

import type { ConfigProviderProps } from 'antd';
import type { ThoughtChainItem } from './Item';
import type { Collapsible } from './hooks/useCollapsible';

export type SemanticType = 'item' | 'itemHeader' | 'itemContent' | 'itemFooter';

export interface ThoughtChainProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * @desc 思维节点集合
   * @descEN chain items
   */
  items?: ThoughtChainItem[];

  /**
   * @desc 是否可折叠
   * @descEN Whether collapsible
   */
  collapsible?: Collapsible;

  /**
   * @desc 组件大小
   * @descEN Component size
   */
  size?: ConfigProviderProps['componentSize'];

  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;

  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<SemanticType, string>>;

  /**
   * @desc 自定义前缀
   * @descEN Prefix
   */
  prefixCls?: string;

  /**
   * @desc 自定义根类名
   * @descEN Custom class name
   */
  rootClassName?: string;
}

const ThoughtChain: React.FC<ThoughtChainProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    items,
    collapsible,
    styles = {},
    style,
    classNames = {},
    size = 'middle',
    ...restProps
  } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  // ============================ Prefix ============================
  const { getPrefixCls, direction, thoughtChain } = useXConfig();

  const rootPrefixCls = getPrefixCls();

  const prefixCls = getPrefixCls('thought-chain', customizePrefixCls);

  // ============================ UseCollapsible ============================
  const [enableCollapse, expandedKeys, onItemExpand, collapseMotion] = useCollapsible(
    collapsible,
    prefixCls,
    rootPrefixCls,
  );

  // ============================ Style ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    className,
    rootClassName,
    prefixCls,
    thoughtChain?.className,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    `${prefixCls}-${size}`,
  );

  // ============================ Render ============================
  return wrapCSSVar(
    <div {...domProps} className={mergedCls} style={mergeStyles(style, thoughtChain?.style)}>
      <ThoughtChainNodeContext.Provider
        value={{
          prefixCls,
          enableCollapse,
          collapseMotion,
          expandedKeys,
          direction,
          classNames: {
            itemHeader: classnames(classNames.itemHeader, thoughtChain?.classNames?.itemHeader),
            itemContent: classnames(classNames.itemContent, thoughtChain?.classNames?.itemContent),
            itemFooter: classnames(classNames.itemFooter, thoughtChain?.classNames?.itemFooter),
          },
          styles: {
            itemHeader: mergeStyles(styles.itemHeader, thoughtChain?.styles?.itemHeader),
            itemContent: mergeStyles(styles.itemContent, thoughtChain?.styles?.itemContent),
            itemFooter: mergeStyles(styles.itemFooter, thoughtChain?.styles?.itemFooter),
          },
        }}
      >
        {items?.map((item, index) => (
          <ThoughtChainNode
            key={item.key || `key_${index}`}
            className={classnames(classNames.item, thoughtChain?.classNames?.item)}
            style={mergeStyles(styles.item, thoughtChain?.styles?.item)}
            info={{
              ...item,
              icon: item.icon || index + 1,
            }}
            onClick={onItemExpand}
            nextStatus={items[index + 1]?.status || item.status}
          />
        ))}
      </ThoughtChainNodeContext.Provider>
    </div>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  ThoughtChain.displayName = 'ThoughtChain';
}

export type { ThoughtChainItem };

export default ThoughtChain;
