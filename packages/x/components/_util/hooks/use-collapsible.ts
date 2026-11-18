import type { CSSMotionProps } from '@rc-component/motion';
import { useControlledState } from '@rc-component/util';
import React from 'react';
import initCollapseMotion from '../../_util/motion';

export type CollapsibleOptions = {
  /**
   * @desc 初始化展开的节点
   * @descEN default expanded keys
   */
  defaultExpandedKeys?: string[];

  /**
   * @desc 当前展开的节点
   * @descEN current expanded keys
   */
  expandedKeys?: string[];

  /**
   * @desc 展开节点变化回调
   * @descEN callback when expanded keys change
   */
  onExpand?: (expandedKeys: string[]) => void;
};

export type Collapsible = boolean | CollapsibleOptions;

type RequiredCollapsibleOptions = Required<CollapsibleOptions>;

type UseCollapsible = (
  collapsible?: Collapsible,
  prefixCls?: string,
  rootPrefixCls?: string,
) => [
  boolean,
  RequiredCollapsibleOptions['expandedKeys'],
  ((curKey: string) => void) | undefined,
  CSSMotionProps,
];

const useCollapsible: UseCollapsible = (collapsible, prefixCls, rootPrefixCls) => {
  const isThoughtChainUnControlled =
    typeof collapsible === 'boolean' || collapsible?.expandedKeys === undefined;
  // ============================ Collapsible ============================
  const [enableCollapse, defaultExpandedKeys, customizeExpandedKeys, customizeOnExpand] =
    React.useMemo(() => {
      let baseConfig: RequiredCollapsibleOptions = {
        expandedKeys: [],
        defaultExpandedKeys: [],
        onExpand: () => {},
      };

      if (!collapsible) {
        return [
          false,
          baseConfig.defaultExpandedKeys,
          baseConfig.expandedKeys,
          baseConfig.onExpand,
        ];
      }

      if (typeof collapsible === 'object') {
        baseConfig = { ...baseConfig, ...collapsible };
      }

      return [true, baseConfig.defaultExpandedKeys, baseConfig.expandedKeys, baseConfig.onExpand];
    }, [collapsible]);

  // ============================ ExpandedKeys ============================
  const [mergedExpandedKeys, setMergedExpandedKeys] = useControlledState<
    RequiredCollapsibleOptions['expandedKeys']
  >(defaultExpandedKeys || [], isThoughtChainUnControlled ? undefined : customizeExpandedKeys);

  // ============================ Event ============================
  // Batched toggles must chain on each other. The committed state (or the
  // controlled prop) is stale within one batch, so keep the pending result
  // in a ref as the base for the next toggle.
  const pendingExpandedKeysRef = React.useRef<string[] | null>(null);

  const onItemExpand = (curKey: string) => {
    const isUncontrolled = isThoughtChainUnControlled;
    const base =
      (isUncontrolled ? pendingExpandedKeysRef.current : null) ??
      (isUncontrolled ? mergedExpandedKeys : customizeExpandedKeys);
    const keys = base.includes(curKey) ? base.filter((key) => key !== curKey) : [...base, curKey];
    if (isUncontrolled) {
      pendingExpandedKeysRef.current = keys;
    }
    setMergedExpandedKeys(keys);
    // Fire outside of the state updater. Updater functions run during render,
    // which would trigger user callbacks in the render phase (#2045).
    customizeOnExpand?.(keys);
  };

  // ============================ Motion ============================

  const collapseMotion: CSSMotionProps = React.useMemo(() => {
    if (!enableCollapse) return {};

    return {
      ...initCollapseMotion(rootPrefixCls),
      motionAppear: false,
      leavedClassName: `${prefixCls}-content-hidden`,
    };
  }, [rootPrefixCls, prefixCls, enableCollapse]);

  // ============================ Return ============================
  return [
    enableCollapse,
    mergedExpandedKeys,
    enableCollapse ? onItemExpand : undefined,
    collapseMotion,
  ];
};

export default useCollapsible;
