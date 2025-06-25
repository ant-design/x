import React, { useMemo } from 'react';
import type { ConversationsProps } from '..';
import type { CollapsibleOptions } from '../../_util/hooks/use-collapsible';
import type { Collapsible, ConversationItemType, GroupableProps, ItemType } from '../interface';

interface GroupConfig {
  label: GroupableProps['label'];
  collapsibleHandle: Collapsible;
  collapsibleOptions: CollapsibleOptions;
}
export interface GroupInfoType {
  data: ItemType[];
  name: string;
  label: GroupableProps['label'];
  enableGroup: boolean;
  collapsible: boolean;
}
type GroupList = GroupInfoType[];

type KeyList = { key: string; disabled?: boolean }[];
const useGroupable = (
  groupable?: ConversationsProps['groupable'],
  items: ItemType[] = [],
): [groupList: GroupList, collapsibleOptions: CollapsibleOptions, keyList: KeyList] => {
  const [label, collapsibleHandle, collapsibleOptions] = useMemo<
    [GroupConfig['label'], GroupConfig['collapsibleHandle'], collapsibleOptions: CollapsibleOptions]
  >(() => {
    let baseConfig: GroupConfig = {
      label: '',
      collapsibleHandle: false,
      collapsibleOptions: {},
    };
    if (!groupable) {
      return ['', baseConfig.collapsibleHandle, baseConfig.collapsibleOptions];
    }

    if (typeof groupable === 'object') {
      const { collapsible, defaultExpandedKeys, expandedKeys, onExpand, ...other } = groupable;
      baseConfig = {
        ...baseConfig,
        ...other,
        collapsibleHandle: collapsible!,
        collapsibleOptions: {
          defaultExpandedKeys,
          expandedKeys,
          onExpand,
        },
      };
    }

    return [baseConfig.label, baseConfig.collapsibleHandle, baseConfig.collapsibleOptions];
  }, [groupable]);

  return React.useMemo(() => {
    const groupList = items.reduce<GroupList>((currentGroupList, item) => {
      if (item?.type === 'divider' || !(item as ConversationItemType).group || !groupable) {
        currentGroupList.push({
          data: [item],
          name: '',
          label: '',
          enableGroup: false,
          collapsible: false,
        });
        return currentGroupList;
      }

      const baseItem = item as Required<ConversationItemType>;
      const isSome = currentGroupList.some((group, index) => {
        if (group.name === baseItem?.group) {
          currentGroupList[index].data.push(baseItem);
          return true;
        }
        return false;
      });
      const collapsible =
        typeof collapsibleHandle === 'function'
          ? collapsibleHandle?.(baseItem?.group)
          : collapsibleHandle;

      if (!isSome) {
        currentGroupList.push({
          data: [baseItem],
          enableGroup: true,
          name: baseItem?.group,
          label,
          collapsible,
        });
      }
      return currentGroupList;
    }, []);
    const keyList = groupList.reduce<KeyList>((currentKeyList, group) => {
      group.data.forEach((item) => {
        if (item.type !== 'divider') {
          currentKeyList.push({
            key: (item as ConversationItemType).key,
            disabled: (item as ConversationItemType).disabled,
          });
        }
      });
      return currentKeyList;
    }, []);
    return [groupList, collapsibleOptions, keyList];
  }, [items, collapsibleOptions]);
};

export default useGroupable;
