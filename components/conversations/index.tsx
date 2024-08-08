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
  const [groupList, ungrouped] = useGroupable(groupable, data);

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

  // ============================ Render ============================
  return wrapCSSVar(
    <ul
      {...htmlULProps}
      className={mergedCls}
    >
      {
        groupList.flatMap((groupInfo, groupIndex) => {
          const convItems = groupInfo.data.map(
            (convInfo: ConversationProps, convIndex: number) => (
              <ConversationsItem
                key={convInfo.key || `key-${convIndex}`}
                info={convInfo}
                prefixCls={prefixCls}
                direction={direction}
                className={classNames?.item}
                style={styles?.item}
                menu={typeof menu === 'function' ? menu(convInfo) : menu}
                active={mergedActiveKey === convInfo.key}
                onClick={(info) => setMergedActiveKey(info.key)}
              />
            ),
          );
          
          return ungrouped
            ? convItems
            : (
              <li key={groupInfo.name || `key-${groupIndex}`}>
                {groupInfo.title || <GroupTitle group={groupInfo.name} direction={direction} key={groupInfo.name} />}
                <ul className={`${prefixCls}-list`}>
                  {convItems}
                </ul>
              </li>
            );
        })
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