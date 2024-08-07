import React from 'react';
import classnames from 'classnames';

import ConversationsItem from './Item';
import GroupTitle from './GroupTitle';

import useMergedState from 'rc-util/lib/hooks/useMergedState';
import useConfigContext from '../config-provider/useConfigContext';
import useGroupable from './hooks/useGroupable';

import useStyle from './style';

import type { ConversationsProps, ConversationProps, Groupable } from './interface';

const Conversations: React.FC<ConversationsProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    data,
    activeKey,
    defaultActiveKey,
    onActiveChange,
    menu,
    styles,
    classNames,
    groupable,
    className,
    ...htmlULProps
  } = props;

  // ============================ ActiveKey ============================
  const [mergedActiveKey, setMergedActiveKey] = useMergedState<ConversationsProps['activeKey']>(
    defaultActiveKey,
    {
      value: activeKey,
      onChange: onActiveChange,
    },
  );

  // ============================ Groupable ============================
  const [groupMap, sortable, customTitleable] = useGroupable(data, groupable);

  // ============================ Prefix ============================
  const { getPrefixCls, direction } = useConfigContext();

  const prefixCls = getPrefixCls('conversations', customizePrefixCls);

  // ============================ Style ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    className,
    rootClassName,
    prefixCls,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );

  // ============================ Item Render ============================
  const itemRender = (item: ConversationProps) => (
    <ConversationsItem
      key={item.key}
      info={item}
      className={classNames?.item}
      style={styles?.item}
      menu={typeof menu === 'function' ? menu(item) : menu}
      active={mergedActiveKey === item.key}
      onClick={() => setMergedActiveKey(item.key)}
    />
  );
  // ==================== Group Title Render ==========================
  const groupTitleRender = (group: string) => {

    if (customTitleable) return (groupable as Groupable)?.title?.(group);

    return <GroupTitle group={group} key={group} />;
  }
  // ==================== Item List Render ============================
  const itemListRender = () => {

    if (!groupable) return data?.map(itemRender);

    const groupKeys = sortable
      ? Object.keys(groupMap).sort((groupable as Groupable).sort)
      : Object.keys(groupMap)

    return groupKeys.flatMap((group) => [
      groupTitleRender(group),
      ...(groupMap[group].map(itemRender) || []),
    ]);
  }
  // ============================ Render ============================
  return wrapCSSVar(
    <ul
      {...htmlULProps}
      className={mergedCls}
    >
      {itemListRender()}
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