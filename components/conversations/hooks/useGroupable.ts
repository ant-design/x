import React from 'react';
import { __UNGROUPED } from '../GroupTitle';
import type { ConversationsProps, ConversationProps, GroupType } from '../interface';

interface GroupedData {
  /**
   * @desc 原数据
   */
  data: ConversationProps[];
  /**
   * @desc 分组处理后的数据
   */
  groupedData: Record<string, ConversationProps[]>;
  /**
   * @desc 分组数据
   */
  groups: GroupType[];
}

function useGroupable(
  data: ConversationProps[],
  groupable: ConversationsProps['groupable'],
): GroupedData {
  return React.useMemo(() => {
    if (!groupable) return {
      data,
      groups: [],
      groupedData: {},
    };

    return data.reduce<GroupedData>(
      (acc, item, index) => {
        const group = item.group || __UNGROUPED;
  
        if (!acc.groupedData[group]) {
          acc.groupedData[group] = [];
          acc.groups.push(group);
        }
  
        acc.groupedData[group].push(item);

        // groupable.sort 可用 且 当前遍历轮次为最后一次
        if (
          typeof groupable === 'object'
          && typeof groupable?.sort === 'function'
          && index === data.length - 1
        ) {
          acc.groups.sort(groupable.sort);
        }
  
        return acc;
      },
      {
        data: [],
        groupedData: {},
        groups: [],
      },
    );
  }, [data, groupable]);
};

export default useGroupable;