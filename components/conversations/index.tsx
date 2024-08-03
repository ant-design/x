import React from 'react';
import classnames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import ConversationsItem from './Item';

import useStyle from './style';
import getPrefixCls from '../_util/getPrefixCls';

import type { ConversationsProps, ConversationProps } from './interface';
import DefaultGroupTitle, { __UNGROUPED } from './GroupTitle';

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
      label: `${prefixCls}-label`,
      menu: `${prefixCls}-menu`,
    },
    prefixCls,
    styles,
    menu: typeof menu === 'function' ? menu(item) : menu,
    onClick: () => setMergedActiveKey(item.key),
  });


  // // ============================ Render Items ============================
  const convItems = React.useMemo(
    () => {
      if (!groupable) return data.map(item => <ConversationsItem key={item.key} {...getItemProps(item)} />);

      const map = data.reduce<Record<string, React.ReactNode[]>>(
        (acc, item) => {
          const group = item.group || __UNGROUPED;

          if (!acc[group]) {
            const GroupTitleComponent = (typeof groupable === 'object' && React.isValidElement(groupable.components?.title))
              ? groupable.components.title
              : DefaultGroupTitle;
            
            acc[group] = [
              <li key={group}>
                <GroupTitleComponent group={group} />
              </li>,
            ];
          }

          acc[group].push(<ConversationsItem key={item.key} {...getItemProps(item)} />);

          return acc;
        },
        {},
      );

      if (typeof groupable === 'object' && typeof groupable?.sort === 'function') {
        return Object
          .keys(map)
          .sort(groupable.sort)
          .flatMap(group => map[group]);
      }

      return Object.values(map).flat();
    },
    [data, groupable, getItemProps],
  );

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