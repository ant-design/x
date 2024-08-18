import React from 'react';
import { Collapse, Steps } from 'antd';
import classnames from 'classnames';

import pickAttrs from 'rc-util/lib/pickAttrs';

import useMergedState from 'rc-util/lib/hooks/useMergedState';
import useConfigContext from '../config-provider/useConfigContext';
import useStyle from './style';

type ThoughtChainItemStatus = 'finish' | 'process';

interface ThoughtChainItem {
  /**
   * @desc 思维节点唯一标识符
   * @descEN Unique identifier
   */
  key: string;

  /**
   * @desc 思维节点标题
   * @descEN Thought chain item title
   */
  title?: React.ReactNode;

  /**
   * @desc 思维节点描述
   * @descEN Thought chain item description
   */
  description?: React.ReactNode;

  /**
   * @desc 思维节点状态
   * @descEN Thought chain item status
   */
  status?: ThoughtChainItemStatus;

  /**
   * @desc 思维节点图标
   * @descEN Thought chain item icon
   */
  icon?: React.ReactNode;

  /**
   * @desc 思维节点子元素
   * @descEN Thought chain item children
   */
  children?: React.ReactNode;
}

export interface ThoughtChainProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * @desc 思维节点集合
   * @descEN chain items
   */
  items?: ThoughtChainItem[];

  /**
   * @desc 思维链标题
   * @descEN Thought chain title
   */
  title?: React.ReactNode;

  /**
   * @desc 思维链标题扩展
   * @descEN Thought chain extra
   */
  extra?: React.ReactNode;

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
    style,
    title,
    extra,
    onExpand,
    expandedKeys,
    ...restProps
  } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  // ============================ Prefix ============================
  const { getPrefixCls, direction } = useConfigContext();

  const prefixCls = getPrefixCls('thought-chain', customizePrefixCls);

  // ============================ Style ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(className, rootClassName, prefixCls, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  return wrapCSSVar(
    <div {...domProps} className={mergedCls}>
      <Steps
        current={items?.length}
        direction="vertical"
        items={items?.map((item) => ({
          title: (
            <Collapse
              style={{ padding: 0 }}
              expandIcon={() => null}
              ghost
              items={[
                {
                  key: item.key,
                  label: item.title,
                  headerClass: `${prefixCls}-item-title`,
                  children: item.children,
                },
              ]}
            />
          ),
          description: item.description,
          className: `${prefixCls}-item`,
        }))}
      />
    </div>,
  );
};

export default ThoughtChain;
