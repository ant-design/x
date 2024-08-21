import React from 'react';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';

import useCollapsible from './hooks/useCollapsible';
import useConfigContext from '../config-provider/useConfigContext';
import useStyle from './style';

import ThoughtChainNode, { ThoughtChainNodeContext } from './Item';

import type { ThoughtChainItem } from './Item';
import type { Collapsible } from './hooks/useCollapsible';

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
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<'item', React.CSSProperties>>;

  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<'item', string>>;

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
    classNames = {},
    ...restProps
  } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  // ============================ Prefix ============================
  const { getPrefixCls, direction } = useConfigContext();

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

  const mergedCls = classnames(className, rootClassName, prefixCls, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  // ============================ Render ============================
  return wrapCSSVar(
    <div {...domProps} className={mergedCls}>
      <ThoughtChainNodeContext.Provider
        value={{
          prefixCls,
          enableCollapse,
          collapseMotion,
          expandedKeys,
        }}
      >
        {items?.map((item, index) => (
          <ThoughtChainNode
            key={item.key || `key_${index}`}
            className={classNames.item}
            style={styles.item}
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
