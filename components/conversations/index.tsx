import React from 'react';
import classnames from 'classnames';

import ConversationsItem from './Item';
import GroupTitle from './GroupTitle';

import useMergedState from 'rc-util/lib/hooks/useMergedState';
import useConfigContext from '../config-provider/useConfigContext';
import useGroupable from './hooks/useGroupable';

import useStyle from './style';

import type { ConversationsProps, ConversationProps } from './interface';

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
    ...htmlULProps
  } = props;

  const [mergedActiveKey, setMergedActiveKey] = useMergedState(defaultActiveKey, {
    value: activeKey,
    defaultValue: defaultActiveKey,
    onChange: onActiveChange,
  });

  const { getPrefixCls } = useConfigContext();

  const prefixCls = getPrefixCls('conversations', customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const groupedData = useGroupable(data, groupable);

  const mergedCls = classnames(
    rootClassName,
    prefixCls,
    hashId,
    cssVarCls,
    classNames?.list,
  );

  const getItemProps = (item: ConversationProps) => ({
    item,
    classNames: {
      item: classnames(
        classNames?.item,
        `${prefixCls}-item`,
        { [`${prefixCls}-item-active`]: item.key === mergedActiveKey && !item.disabled },
        { [`${prefixCls}-item-disabled`]: item.disabled },
      ),
      label: classnames(`${prefixCls}-label`, classNames?.label),
      menuIcon: classnames(`${prefixCls}-menu-icon`, classNames?.menuIcon),
      icon: classnames(`${prefixCls}-icon`, classNames?.icon),
    },
    prefixCls,
    styles,
    menu: typeof menu === 'function' ? menu(item) : menu,
    onClick: () => setMergedActiveKey(item.key),
  });

  // ============================ Render ============================
  const itemRender = (item: ConversationProps) => <ConversationsItem key={item.key} {...getItemProps(item)} />;
  
  const groupRender = (group: string) => <GroupTitle key={group} group={group} groupable={groupable} />;

  return wrapCSSVar(
    <ul
      {...htmlULProps}
      className={mergedCls}
      style={styles?.list}
    >
      {
        !groupable
          ? groupedData.data.map(itemRender)
          : groupedData.groups.flatMap((group) => [
              groupRender(group),
              ...groupedData.groupedData[group].map(itemRender),
          ])
      }
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