import * as React from 'react';
import type { BubbleDataType, BubbleListProps } from '../BubbleList';
import type { BubbleProps } from '../interface';

export default function useListData(
  data: BubbleListProps['data'],
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
      (data || []).map((bubbleData) => ({
        ...getRoleBubbleProps(bubbleData),
        ...bubbleData,
      })),
    [data, getRoleBubbleProps],
  );
}
