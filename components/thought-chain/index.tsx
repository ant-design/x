import React from 'react';
import { Avatar, Collapse, Typography } from 'antd';
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
   * @desc 思维节点额外内容
   * @descEN Thought chain item extra content
   */
  extra?: React.ReactNode;

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
    onExpand,
    expandedKeys,
    ...restProps
  } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  // ============================ ExpandedKeys ============================
  const [mergedExpandedKey, setMergedExpandedKey] = useMergedState<
    ThoughtChainProps['expandedKeys']
  >([], {
    value: expandedKeys,
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
      {items?.map((item) => (
        <div key={item.key} className={`${prefixCls}-item`}>
          <div
            className={`${prefixCls}-item-header`}
            onClick={() => setMergedExpandedKey((pre) => [...pre, item.key])}
          >
            {item.icon && <Avatar icon={item.icon} className={`${prefixCls}-item-icon`} />}
            <Typography.Text
              strong
              ellipsis={{ tooltip: true }}
              className={`${prefixCls}-item-title`}
            >
              {item.title}
            </Typography.Text>
            <Typography.Text type="secondary" className={`${prefixCls}-item-desc`}>
              {item.description}
            </Typography.Text>
            {item.extra && <div className={`${prefixCls}-item-extra`}>{item.extra}</div>}
          </div>
          {item.children && (
            <div className={`${prefixCls}-item-content`}>
              <Collapse
                ghost
                activeKey={mergedExpandedKey}
                items={[
                  {
                    showArrow: false,
                    headerClass: `${prefixCls}-item-content-header`,
                    key: item.key,
                    children: item.children,
                  },
                ]}
              />
            </div>
          )}
        </div>
      ))}
    </div>,
  );
};

export default ThoughtChain;
