import * as React from 'react';
import type { BubbleDataType, BubbleListProps } from '../BubbleList';
import type { BubbleProps } from '../interface';

export type ListItemType = ReturnType<typeof useListData>[number];

export default function useListData(
  items: BubbleListProps['items'],
  roles?: BubbleListProps['roles'],
) {
  const getRoleBubbleProps = React.useCallback(
    (bubble: BubbleDataType, index: number): Partial<BubbleProps> => {
      if (typeof roles === 'function') {
        return roles(bubble, index);
      }

      if (roles) {
        return roles[bubble.role!] || {};
      }

      return {};
    },
    [roles],
  );

  return React.useMemo(
    () =>
      (items || []).map((bubbleData, i) => {
        const mergedKey = bubbleData.key ?? `preset_${i}`;

        return {
          ...getRoleBubbleProps(bubbleData, i),
          ...bubbleData,
          key: mergedKey,
        };
      }),
    [items, getRoleBubbleProps],
  );
}
