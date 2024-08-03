import React from 'react';
import { Divider, Typography } from 'antd';
import classnames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import ConversationsItem from './Item';

import useStyle from './style';
import getPrefixCls from '../_util/getPrefixCls';

import type { ReactNode } from 'react';
import type { ConversationsProps, ConversationProps, GroupType } from './interface';

const Conversations: React.FC<ConversationsProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    data = [],
    activeKey,
    defaultActiveKey = '',
    onActiveChange,
    menu,
    styles,
    classNames,
    groupable,
  } = props;

  const prefixCls = getPrefixCls('conversations', customizePrefixCls);

  const [mergedActiveKey, setMergedActiveKey] = useMergedState(defaultActiveKey, {
    value: activeKey,
    defaultValue: defaultActiveKey,
    onChange: onActiveChange,
  });

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    rootClassName,
    prefixCls,
    hashId,
    cssVarCls,
    styles?.list,
  );

  const groupedMap = data.reduce((map, item) => {
    const { group = '' } = item;

    if (!Array.isArray(map[group])) {
      map[group] = [];
    }

    map[group].push(item);

    return map;
  }, {} as Record<GroupType, ConversationProps[]>);

  const getItemProps = React.useCallback((item: ConversationProps) => ({
    ...item,
    classNames: {
      item: classnames(
        classNames?.item,
        `${prefixCls}-item`,
        { [`${prefixCls}-item-active`]: item.key === mergedActiveKey && !item.disabled },
        { [`${prefixCls}-item-disabled`]: item.disabled },
      ),
      label: classnames(`${prefixCls}-label`, classNames?.item),
      menu: `${prefixCls}-menu`,
    },
    prefixCls,
    styles: styles,
    menu: typeof menu === 'function' ? menu(item) : menu,
    onClick: () => setMergedActiveKey(item.key),
  }), [classNames, prefixCls, mergedActiveKey, styles, menu, setMergedActiveKey]);

  // ============================ Render Items ============================
  const convItems = React.useMemo(() => Object.keys(groupedMap).reduce(
    (nodes, group) => {

      if (groupable) {
        nodes.push(
          <li key={group}>
            {
              (typeof groupable === 'object' && React.isValidElement(groupable.components?.title))
                ? React.createElement(groupable.components.title, { group })
                : (
                  <Divider orientation="left" plain>
                    <Typography.Text type="secondary">
                      {group}
                    </Typography.Text>
                  </Divider>
                )
            }
          </li>,
        );
      }

      return [
        ...nodes,
        ...groupedMap[group].map(item => React.createElement(ConversationsItem, getItemProps(item))),
      ];
    },
    [] as ReactNode[],
  ), [groupedMap, groupable, getItemProps]);

  
  // ============================ Render ============================
  return wrapCSSVar(
    <ul className={mergedCls} style={styles?.list}>
      {convItems}
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