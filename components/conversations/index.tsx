import React, { useMemo } from 'react';
import { Button, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';

import sorters from './sorter';
import useStyle from './style';
import getPrefixCls from '../_util/getPrefixCls';

import type { ReactNode } from 'react';
import type { ConversationsProps, ConversationProps } from './interface';

const Conversations: React.FC<ConversationsProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    data = [],
    activeKey,
    defaultActiveKey = '',
    onChange,
    menu,
    sorter,
    styles,
    classNames,
  } = props;


  const [mergedActiveKey, setMergedActiveKey] = useMergedState(defaultActiveKey, {
    value: activeKey,
    defaultValue: defaultActiveKey,
    onChange,
  });

  const prefixCls = getPrefixCls('conversations', customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    rootClassName,
    prefixCls,
    hashId,
    cssVarCls,
    styles?.list,
  );

  const sortedData = useMemo(
    () => (sorter && sorters[sorter])
      ? sorters[sorter](data)
      : data,
    [data, sorter],
  );

  const makeItemProps = (item: ConversationProps) => ({
    className: classnames(
      classNames?.item,
      `${prefixCls}-item`,
      { [`${prefixCls}-item-active`]: item.key === mergedActiveKey },
    ),
    style: styles?.item,
    onClick: () => setMergedActiveKey(item.key),
  });

  const mergedLabelCls = classnames(`${prefixCls}-label`, classNames?.item);
  const mergedMenuCls = classnames(`${prefixCls}-menu`, classNames?.item);

  const convNodes = sortedData.reduce((nodes, item) => {
    const {
      key,
      label,
    } = item;

    const itemProps = makeItemProps(item);

    const node = (
      <li
        className={itemProps.className}
        style={itemProps.style}
        onClick={itemProps.onClick}
        key={key}
      >
        <span className={mergedLabelCls}>{label}</span>
        {menu &&
          <Dropdown
            menu={menu}
            autoAdjustOverflow
            getPopupContainer={(triggerNode) => triggerNode.parentElement ?? document.body}
          >
            <Button
              onClick={(event) => {
                event.stopPropagation();
              }}
              className={mergedMenuCls}
              type="text"
              icon={<MoreOutlined />}
            />
          </Dropdown>}
      </li>
    );

    if (item.pinned) {
      nodes.unshift(node);
    } else {
      nodes.push(node);
    }

    return nodes;
  }, [] as ReactNode[]);

  return wrapCSSVar(
    <ul className={mergedCls} style={styles?.list}>
      {convNodes}
    </ul>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Conversations.displayName = 'Conversations';
}

export type {
  ConversationsProps,
  ConversationProps,
};

export default Conversations;