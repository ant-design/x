import { useEvent } from 'rc-util';
import React from 'react';
import { ListItemType } from './useListData';

export default function useDisplayData(items: ListItemType[]) {
  const [displayCount, setDisplayCount] = React.useState(items.length);

  const displayList = React.useMemo(() => items.slice(0, displayCount), [items, displayCount]);

  const displayListLastKey = React.useMemo(() => {
    const lastItem = displayList[displayList.length - 1];
    return lastItem ? lastItem.key : null;
  }, [displayList]);

  // When `items` changed, we replaced with latest one
  React.useEffect(() => {
    if (displayList.length && displayList.every((item, index) => item.key === items[index]?.key)) {
      return;
    }

    if (displayList.length === 0) {
      setDisplayCount(1);
    } else {
      // Find diff index
      for (let i = 0; i < displayList.length; i += 1) {
        if (displayList[i].key !== items[i]?.key) {
          setDisplayCount(i);
          break;
        }
      }
    }
  }, [items]);

  // Continue to show if last one finished typing
  const onTypingComplete = useEvent((key: string | number) => {
    if (key === displayListLastKey) {
      setDisplayCount(displayCount + 1);
    }
  });

  return [displayList, onTypingComplete] as const;
}
