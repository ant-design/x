import { useControlledState } from '@rc-component/util';
import React from 'react';
import type { ChangeInfo, ChoiceItemType, ChoiceValueType } from '../interface';

export interface UseSelectOptions {
  mode: 'single' | 'multiple';
  value?: ChoiceValueType | ChoiceValueType[];
  defaultValue?: ChoiceValueType | ChoiceValueType[];
  onChange?: (value: ChoiceValueType | ChoiceValueType[], info: ChangeInfo) => void;
  maxCount?: number;
  disabled?: boolean;
  items: ChoiceItemType[];
}

function toArray(value: ChoiceValueType | ChoiceValueType[] | undefined): ChoiceValueType[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

export default function useSelect(options: UseSelectOptions) {
  const { mode, value, defaultValue, onChange, maxCount, disabled, items } = options;

  const normalizedDefaultValue = React.useMemo(() => toArray(defaultValue), [defaultValue]);

  const normalizedValue = React.useMemo(() => {
    if (value === undefined) return undefined;
    return toArray(value);
  }, [value]);

  // Normalize to array internally
  const [mergedValue, setMergedValue] = useControlledState<ChoiceValueType[]>(
    normalizedDefaultValue,
    normalizedValue,
  );

  const isSelected = React.useCallback(
    (key: ChoiceValueType) => mergedValue.includes(key),
    [mergedValue],
  );

  const isMaxReached = React.useMemo(() => {
    if (mode !== 'multiple' || !maxCount) return false;
    return mergedValue.length >= maxCount;
  }, [mode, maxCount, mergedValue.length]);

  const handleItemClick = React.useCallback(
    (item: ChoiceItemType, _index: number) => {
      if (disabled || item.disabled) return;

      const key = item.key;
      let nextValue: ChoiceValueType[];
      let changeType: 'select' | 'deselect';
      let changedItems: ChoiceItemType[];

      if (mode === 'single') {
        if (isSelected(key)) {
          nextValue = [];
          changeType = 'deselect';
          changedItems = [item];
        } else {
          nextValue = [key];
          changeType = 'select';
          changedItems = [item];
        }
      } else {
        if (isSelected(key)) {
          nextValue = mergedValue.filter((v) => v !== key);
          changeType = 'deselect';
          changedItems = [item];
        } else {
          if (maxCount && mergedValue.length >= maxCount) return;
          nextValue = [...mergedValue, key];
          changeType = 'select';
          changedItems = [item];
        }
      }

      setMergedValue(nextValue);

      if (onChange) {
        const info: ChangeInfo = {
          value: mode === 'single' ? nextValue[0] : nextValue,
          items,
          changedItems,
          type: changeType,
        };
        onChange(info.value, info);
      }
    },
    [disabled, mode, isSelected, mergedValue, maxCount, setMergedValue, onChange, items],
  );

  return {
    mergedValue,
    handleItemClick,
    isSelected,
    isMaxReached,
  };
}
