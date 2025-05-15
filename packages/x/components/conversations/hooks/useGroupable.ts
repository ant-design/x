import React from 'react';
import type { Conversation, Groupable } from '../interface';
import type { ConversationsProps } from '..';

/**
 * 🔥 Only for handling ungrouped data. Do not use it for any other purpose! 🔥
 */
const __UNGROUPED = '__ungrouped';

type GroupList = {
  data: Conversation[];
  name?: string;
  title?: Groupable['title'];
}[];

type GroupMap = Record<string, Conversation[]>;

const useGroupable = (
  groupable?: ConversationsProps['groupable'],
  items: Conversation[] = [],
): [groupList: GroupList, enableGroup: boolean] => {
  const [enableGroup, sort, title] = React.useMemo(() => {
    if (!groupable) {
      return [false, undefined, undefined];
    }

    let baseConfig: Groupable = {
      sort: undefined,
      title: undefined,
    };

    if (typeof groupable === 'object') {
      baseConfig = { ...baseConfig, ...groupable };
    }

    return [true, baseConfig.sort, baseConfig.title];
  }, [groupable]);

  return React.useMemo(() => {
    // 未开启分组模式直接返回
    if (!enableGroup) {
      const groupList = [
        {
          name: __UNGROUPED,
          data: items,
          title: undefined,
        },
      ];

      return [groupList, enableGroup];
    }

    // 1. 将 data 做数据分组，填充 groupMap
    const groupMap = items.reduce<GroupMap>((acc, item) => {
      const group = item.group || __UNGROUPED;

      if (!acc[group]) {
        acc[group] = [];
      }

      acc[group].push(item);

      return acc;
    }, {});

    // 2. 存在 sort 时对 groupKeys 排序
    const groupKeys = sort ? Object.keys(groupMap).sort(sort) : Object.keys(groupMap);

    // 3. groupMap 转 groupList
    const groupList = groupKeys.map((group) => ({
      name: group === __UNGROUPED ? undefined : group,
      title,
      data: groupMap[group],
    }));

    return [groupList, enableGroup];
  }, [items, groupable]);
};

export default useGroupable;
