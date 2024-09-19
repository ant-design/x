import * as React from 'react';
import type { BubbleDataType, BubbleListProps } from '../BubbleList';
import type { BubbleProps } from '../interface';

export type ListItemType = ReturnType<typeof useListData>[number];

export default function useListData(
  items: BubbleListProps['items'],
  roles?: BubbleListProps['roles'],
) {
  const getRoleBubbleProps = React.useCallback(
    (bubble: BubbleDataType): Partial<BubbleProps> => {
      if (typeof roles === 'function') {
        return roles(bubble);
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
          ...getRoleBubbleProps(bubbleData),
          ...bubbleData,
          key: mergedKey,
        };
      }),
    [items, getRoleBubbleProps],
  );
}
