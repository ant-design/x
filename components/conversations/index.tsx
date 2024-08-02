import React, { useMemo } from 'react';
import { Divider, Dropdown, Typography } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';

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

  const [mergedActiveKey, setMergedActiveKey] = useMergedState(defaultActiveKey, {
    value: activeKey,
    defaultValue: defaultActiveKey,
    onChange: onActiveChange,
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

  const makeItemProps = (item: ConversationProps) => ({
    className: classnames(
      classNames?.item,
      `${prefixCls}-item`,
      { [`${prefixCls}-item-active`]: item.key === mergedActiveKey && !item.disabled },
      { [`${prefixCls}-item-disabled`]: item.disabled },
    ),
    style: styles?.item,
    menu: typeof menu === 'function' ? menu(item) : menu,
    onClick: () => setMergedActiveKey(item.key),
  });

  const mergedLabelCls = classnames(`${prefixCls}-label`, classNames?.item);
  const mergedMenuCls = classnames(`${prefixCls}-menu`, classNames?.item);

  const groupedMap = data.reduce((map, item) => {
    const { group = 'default' } = item;

    if (!Array.isArray(map[group])) {
      map[group] = [];
    }

    map[group].push(item);

    return map;
  }, {} as Record<GroupType, ConversationProps[]>);

  function renderConversationItem(item: ConversationProps) {
    const itemProps = makeItemProps(item);

    return (
      <li
        className={itemProps.className}
        style={itemProps.style}
        onClick={item.disabled ? undefined : itemProps.onClick}
        key={item.key}
      >
        {item.icon && <div className={`${prefixCls}-icon`}>
          {item.icon}
        </div>}
        <Typography.Text
          className={mergedLabelCls}
          ellipsis={{ tooltip: item.label }}
        >
          {item.label}
        </Typography.Text>
        {menu && !item.disabled &&
          <Dropdown
            menu={itemProps.menu}
            disabled={item.disabled}
            getPopupContainer={(triggerNode) => triggerNode.parentElement ?? document.body}
          >
            <MoreOutlined
              onClick={(event) => {
                event.stopPropagation();
              }}
              disabled={item.disabled}
              className={mergedMenuCls}
            />
          </Dropdown>}
      </li>
    )
  }

  const conversationItems = useMemo(() => Object.keys(groupedMap).reduce(
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
        ...groupedMap[group].map(renderConversationItem),
      ]
    },
    [] as ReactNode[],
  ), [groupedMap, groupable]);

  return wrapCSSVar(
    <ul className={mergedCls} style={styles?.list}>
      {conversationItems}
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