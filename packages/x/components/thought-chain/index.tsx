import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';
import useCollapsible from '../_util/hooks/use-collapsible';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import Item from './Item';
import type { ThoughtChainItem, ThoughtChainProps } from './interface';
import ThoughtChainNode, { ThoughtChainContext } from './Node';
import useStyle from './style';

type CompoundedComponent = {
  Item: typeof Item;
};

const ThoughtChain: React.FC<ThoughtChainProps> & CompoundedComponent = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    items,
    defaultExpandedKeys,
    expandedKeys: customExpandedKeys,
    onExpand,
    rootClassName,
    styles = {},
    classNames = {},
    line = true,
    style,

    ...restProps
  } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  // ============================ Prefix ============================
  const { direction, getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('thought-chain', customizePrefixCls);

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('thoughtChain');

  // ============================ Style ============================

  const [hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    className,
    prefixCls,
    contextConfig.className,
    contextConfig.classNames.root,
    rootClassName,
    hashId,
    cssVarCls,
    className,
    classNames.root,
    `${prefixCls}-box`,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );
  //  ============================ Item Collapsible ============================

  const rootPrefixCls = getPrefixCls();
  const collapsibleOptions = {
    defaultExpandedKeys,
    expandedKeys: customExpandedKeys,
    onExpand,
  };
  const [_, expandedKeys, onItemExpand, collapseMotion] = useCollapsible(
    collapsibleOptions,
    prefixCls,
    rootPrefixCls,
  );

  // ============================ Render ============================
  return (
    <div
      {...domProps}
      className={mergedCls}
      style={{ ...contextConfig.style, ...styles.root, ...style }}
    >
      <ThoughtChainContext.Provider
        value={{
          prefixCls,
          expandedKeys,
          onItemExpand,
          collapseMotion,
          classNames: {
            itemHeader: classnames(contextConfig.classNames.itemHeader, classNames.itemHeader),
            itemContent: classnames(contextConfig.classNames.itemContent, classNames.itemContent),
            itemFooter: classnames(contextConfig.classNames.itemFooter, classNames.itemFooter),
            itemIcon: classnames(contextConfig.classNames.itemIcon, classNames.itemIcon),
          },
          styles: {
            itemHeader: { ...contextConfig.styles.itemHeader, ...styles.itemHeader },
            itemContent: { ...contextConfig.styles.itemContent, ...styles.itemContent },
            itemFooter: { ...contextConfig.styles.itemFooter, ...styles.itemFooter },
            itemIcon: { ...contextConfig.styles.itemIcon, ...styles.itemIcon },
          },
        }}
      >
        {items?.map((item, index) => (
          <ThoughtChainNode
            key={item.key || `key_${index}`}
            index={index}
            line={line}
            className={classnames(contextConfig.classNames.item, classNames.item)}
            style={{ ...contextConfig.styles.item, ...styles.item }}
            info={item}
          />
        ))}
      </ThoughtChainContext.Provider>
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  ThoughtChain.displayName = 'ThoughtChain';
}

ThoughtChain.Item = Item;
export type { ThoughtChainProps, ThoughtChainItem };
export default ThoughtChain;
