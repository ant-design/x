import { useCallback, useEffect, useRef, useState } from 'react';
import type { SlotConfigType } from '../../sender';

const buildSlotValues = (
  slotConfig: readonly SlotConfigType[],
  slotConfigMap: { current: Map<string, SlotConfigType> },
) => {
  if (Array.isArray(slotConfig)) {
    return slotConfig?.reduce(
      (acc, node) => {
        if (node.key) {
          if (
            node.type === 'input' ||
            node.type === 'select' ||
            node.type === 'custom' ||
            node.type === 'content'
          ) {
            acc[node.key] = node.props?.defaultValue || '';
          } else if (node.type === 'tag') {
            acc[node.key] = node.props?.value || node.props?.label || '';
          } else {
            acc[node.key] = '';
          }
          slotConfigMap.current.set(node.key, node);
        }

        return acc;
      },
      {} as Record<string, any>,
    );
  }
  return {};
};

function useSlotConfigState(
  slotConfig: readonly SlotConfigType[],
): [
  Map<string, SlotConfigType>,
  () => Record<string, any>,
  React.Dispatch<React.SetStateAction<Record<string, any>>>,
  (slotConfigs: SlotConfigType[]) => void,
] {
  const [state, _setState] = useState({});
  const stateRef = useRef(state);
  const slotConfigMap = useRef<Map<string, SlotConfigType>>(new Map());

  useEffect(() => {
    const slotValue = buildSlotValues(slotConfig, slotConfigMap);
    _setState(slotValue);
    stateRef.current = slotValue;
  }, [slotConfig]);

  const setState = useCallback((newValue: React.SetStateAction<Record<string, any>>) => {
    const value = typeof newValue === 'function' ? newValue(stateRef.current) : newValue;
    stateRef.current = value;
    _setState(value);
  }, []);

  const setSlotConfigMap = useCallback((slotConfigs: SlotConfigType[]) => {
    slotConfigs.forEach((config) => {
      if (config.key) {
        slotConfigMap.current.set(config.key, config);
      }
    });
  }, []);

  const getState = useCallback(() => {
    return stateRef.current;
  }, []);

  return [slotConfigMap.current, getState, setState, setSlotConfigMap];
}

export default useSlotConfigState;
