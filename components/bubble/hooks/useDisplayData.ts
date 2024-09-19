import React from 'react';
import { ListItemType } from './useListData';
import { useEvent } from 'rc-util';

export default function useDisplayData(items: ListItemType[]) {
  const [typing, setTyping] = React.useState(false);
  const [displayData, setDisplayData] = React.useState(items);

  // const [displayCount, setDisplayCount] = React.useState(Math.max(1, items.length));

  // const displayList = React.useMemo(() => items.slice(0, displayCount), [items, displayCount]);

  // When `items` changed, we replaced with latest one
  React.useEffect(() => {
    // console.log('Compare Effect:', displayData, items);
    // let notMatchIndex = displayData.length;

    // for (let i = 0; i < displayData.length; i += 1) {
    //   if (displayData[i].key !== items[i]?.key) {
    //     notMatchIndex = i;
    //     console.log('fuck!', i);
    //     break;
    //   }
    // }

    // console.log('==>', notMatchIndex);
    // setDisplayData(items.slice(0, notMatchIndex + 1));
    if (
      items.length !== displayData.length ||
      items.some((item, index) => item.key !== displayData[index].key)
    ) {
      setTyping(true);
    }
  }, [items]);

  // Continue to show if last one finished typing
  const onTypingComplete = useEvent((key: string | number) => {
    const displayLen = displayData.length;
    const lastKey = displayData[displayLen - 1]?.key;

    if (typing && lastKey === key) {
      setTyping(false);
      setDisplayData(items.slice(0, displayLen + 1));
    }
  });

  return [displayData, onTypingComplete] as const;
}
