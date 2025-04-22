import useMergedState from 'rc-util/lib/hooks/useMergedState';
import React from 'react';
import initCollapseMotion from '../../_util/motion';

import type { CSSMotionProps } from 'rc-motion';

export type CollapsibleOptions = {
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
  // ============================ Collapsible ============================
  const [enableCollapse, customizeExpandedKeys, customizeOnExpand] = React.useMemo(() => {
    let baseConfig: RequiredCollapsibleOptions = {
      expandedKeys: [],
      onExpand: () => {},
    };

    if (!collapsible) {
      return [false, baseConfig.expandedKeys, baseConfig.onExpand];
    }

    if (typeof collapsible === 'object') {
      baseConfig = { ...baseConfig, ...collapsible };
    }

    return [true, baseConfig.expandedKeys, baseConfig.onExpand];
  }, [collapsible]);

  // ============================ ExpandedKeys ============================
  const [mergedExpandedKeys, setMergedExpandedKeys] = useMergedState<
    RequiredCollapsibleOptions['expandedKeys']
  >([], {
    value: customizeExpandedKeys,
    onChange: customizeOnExpand,
  });

  // ============================ Event ============================
  const onItemExpand = (curKey: string) => {
    setMergedExpandedKeys((preKeys) => {
      const keys = preKeys.includes(curKey)
        ? preKeys.filter((key) => key !== curKey)
        : [...preKeys, curKey];
      customizeOnExpand?.(keys);
      return keys;
    });
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
