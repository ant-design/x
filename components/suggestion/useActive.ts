import { useEvent } from 'rc-util';
import type { SuggestionItem } from '.';
import React from 'react';

/**
 * Since Cascader not support ref active, we use `value` to mock the active item.
 */
export default function useActive(
  items: SuggestionItem[],
  open: boolean,
  rtl: boolean,
  onSelect: (value: string[]) => void,
  onCancel: () => void,
) {
  const [activePaths, setActivePaths] = React.useState<string[]>([]);

  /** Get items by column index */
  const getItems = (colIndex: number, paths = activePaths) => {
    let currentItems = items;

    for (let i = 0; i < colIndex - 1; i += 1) {
      const activePath = paths[i];
      const activeItem = currentItems.find((item) => item.value === activePath);

      if (!activeItem) {
        break;
      }

      currentItems = activeItem.children || [];
    }

    return currentItems;
  };

  const getValues = (paths: string[]) => {
    return paths.map((path, index) => {
      const currentItems = getItems(index + 1, paths);
      const currentItem = currentItems.find((item) => item.value === path);

      return currentItem?.value;
    }) as string[];
  };

  const offsetRow = (offset: number) => {
    const currentColIndex = activePaths.length || 1;

    const currentItems = getItems(currentColIndex);
    const currentRowIndex = currentItems.findIndex(
      (item) => item.value === activePaths[currentColIndex - 1],
    );
    const itemCount = currentItems.length;

    const nextItem = currentItems[(currentRowIndex + offset + itemCount) % itemCount];
    setActivePaths([...activePaths.slice(0, currentColIndex - 1), nextItem.value]);
  };

  const offsetPrev = () => {
    if (activePaths.length > 1) {
      setActivePaths(activePaths.slice(0, activePaths.length - 1));
    }
  };

  const offsetNext = () => {
    const nextItems = getItems(activePaths.length + 1);
    if (nextItems.length) {
      setActivePaths([...activePaths, nextItems[0].value]);
    }
  };

  const onKeyDown: React.KeyboardEventHandler = useEvent((e) => {
    if (!open) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        offsetRow(1);
        e.preventDefault();
        break;

      case 'ArrowUp':
        offsetRow(-1);
        e.preventDefault();
        break;

      case 'ArrowRight':
        if (rtl) {
          offsetPrev();
        } else {
          offsetNext();
        }
        e.preventDefault();
        break;

      case 'ArrowLeft':
        if (rtl) {
          offsetNext();
        } else {
          offsetPrev();
        }
        e.preventDefault();
        break;

      case 'Enter':
        // Submit if not have children
        if (!getItems(activePaths.length + 1).length) {
          onSelect(getValues(activePaths));
        }
        e.preventDefault();
        break;

      case 'Escape':
        onCancel();
        e.preventDefault();
        break;
    }
  });

  React.useEffect(() => {
    if (open) {
      setActivePaths([items[0].value]);
    }
  }, [open]);

  return [activePaths, onKeyDown] as const;
}
