import React from 'react';
import type { ConversationsProps, ConversationProps, Groupable } from '../interface';

/**
 * 🔥 Only for handling ungrouped data. Do not use it for any other purpose! 🔥
 */
const __UNGROUPED = '__ungrouped';

type GroupList = {
  data: ConversationProps[];
  name?: string;
  title?: React.ReactNode;
}[];

type GroupMap = Record<string, ConversationProps[]>;

type UseGroupable = (
  groupable?: ConversationsProps['groupable'],
  data?: ConversationProps[],
) => [GroupList, boolean];

const useGroupable: UseGroupable = (
  groupable?: ConversationsProps['groupable'],
  data: ConversationProps[] = [],
) => {
  const [
    ungrouped,
    sort,
    title,
  ] = React.useMemo(() => {
    if (!groupable) {
      return [true, undefined, undefined];
    }

    let baseConfig: Groupable = {
      sort: undefined,
      title: undefined,
    };

    if (typeof groupable === 'object') {
      baseConfig = { ...baseConfig, ...groupable };
    }

    return [
      false,
      baseConfig.sort,
      baseConfig.title,
    ];
  }, [groupable]);

  return React.useMemo(() => {
    // 未开启分组模式直接返回
    if (ungrouped) {
      const groupList = [
        {
          name: __UNGROUPED,
          data,
          title: undefined,
        },
      ]

      return [groupList, ungrouped];
    };

    // 1. 将 data 做数据分组，填充 groupMap
    const groupMap = data.reduce<GroupMap>(
      (acc, item) => {
        const group = item.group || __UNGROUPED;

        if (!acc[group]) {
          acc[group] = [];
        }

        acc[group].push(item);

        return acc;
      },
      {},
    );

    // 2. 存在 sort 时对 groupKeys 排序
    const groupKeys = sort
      ? Object.keys(groupMap).sort(sort)
      : Object.keys(groupMap);

    // 2. groupMap 转 groupList
    const groupList = groupKeys.map((group) => ({
      name: group === __UNGROUPED ? undefined : group,
      title: title && title(group),
      data: groupMap[group],
    }));

    return [groupList, ungrouped];
  }, [data, groupable]);
};

export default useGroupable;