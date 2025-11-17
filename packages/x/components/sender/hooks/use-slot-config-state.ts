import { useCallback, useEffect, useRef, useState } from 'react';
import type { SlotConfigType } from '../../sender';
import type { EditSlotConfigType } from '../interface';

const buildSlotValues = (
  slotConfig: SlotConfigType[],
  slotConfigMap: { current: Map<string, SlotConfigType> },
  editSlotConfigMap: { current: Map<string, EditSlotConfigType> },
) => {
  if (Array.isArray(slotConfig)) {
    return slotConfig?.reduce(
      (acc, node) => {
        if (node.key) {
          if (node.type === 'input' || node.type === 'select' || node.type === 'custom') {
            acc[node.key] = node.props?.defaultValue || '';
          } else if (node.type === 'tag') {
            acc[node.key] = node.props?.value || node.props?.label || '';
          } else {
            acc[node.key] = '';
          }
          if (node.type === 'content') {
            editSlotConfigMap.current.set(node.key, node);
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
  slotConfig: SlotConfigType[],
): [
  Map<string, SlotConfigType>,
  Map<string, EditSlotConfigType>,
  SlotConfigType[],
  () => Record<string, any>,
  React.Dispatch<React.SetStateAction<Record<string, any>>>,
  (slotConfigs: SlotConfigType[]) => void,
] {
  const [state, _setState] = useState({});
  const stateRef = useRef(state);
  const slotConfigMap = useRef<Map<string, SlotConfigType>>(new Map());
  const editSlotConfigMap = useRef<Map<string, EditSlotConfigType>>(new Map());
  const slotConfigRef = useRef<SlotConfigType[]>(slotConfig);

  useEffect(() => {
    const slotValue = buildSlotValues(slotConfig, slotConfigMap, editSlotConfigMap);
    _setState(slotValue);
    stateRef.current = slotValue;
    slotConfigRef.current = slotConfig;
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

  return [
    slotConfigMap.current,
    editSlotConfigMap.current,
    slotConfigRef.current,
    getState,
    setState,
    setSlotConfigMap,
  ];
}

export default useSlotConfigState;
