import React from 'react';
import type { ConversationsProps, ConversationProps } from '../interface';

/**
 * 🔥 Only for handling ungrouped data. Do not use it for any other purpose! 🔥
 */
const __UNGROUPED = '__ungrouped';

export const isValidGroupTitle = (group?: string) => group !== undefined && group !== __UNGROUPED;

type GroupMap = Record<string, ConversationProps[]>;

type UseGroupable = (
  data?: ConversationProps[],
  groupable?: ConversationsProps['groupable'],
) => [
  GroupMap,
  boolean,
  boolean,
];

const useGroupable: UseGroupable = (
  data?: ConversationProps[],
  groupable?: ConversationsProps['groupable'],
) => React.useMemo(() => {

  const groupMap = (data || []).reduce<GroupMap>(
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

  const sortable = (typeof groupable === 'object' && typeof groupable?.sort === 'function');

  const customTitleable = (typeof groupable === 'object' && typeof groupable?.title === 'function');

  return [
    groupMap,
    sortable,
    customTitleable,
  ];
}, [data, groupable]);

export default useGroupable;