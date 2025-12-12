import { useCallback, useEffect, useRef, useState } from 'react';
import type { SlotConfigType } from '../../sender';

interface NodeInfo {
  slotKey?: string;
  nodeType?: 'nbsp';
  skillKey?: string;
  slotConfig?: SlotConfigType;
  placeholder?: string;
  targetNode: HTMLElement;
}

interface SlotValues {
  [key: string]: any;
}

const buildSlotValues = (
  slotConfig: readonly SlotConfigType[],
  slotConfigMap: { current: Map<string, SlotConfigType> },
): SlotValues => {
  return slotConfig?.reduce<SlotValues>((acc, node) => {
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
      }
      slotConfigMap.current.set(node.key, node);
    }

    return acc;
  }, {});
};

const getNodeInfoBySlotConfigMap = (
  targetNode: HTMLElement,
  slotConfigMap: Map<string, SlotConfigType>,
): NodeInfo | null => {
  if (!targetNode || !(targetNode instanceof HTMLElement)) {
    return null;
  }
  const { dataset } = targetNode;
  const slotKey = dataset.slotKey;
  const slotConfig = slotKey ? slotConfigMap.get(slotKey) : undefined;

  return {
    slotKey,
    placeholder: dataset.dataset,
    nodeType: dataset.nodeType as 'nbsp' | undefined,
    skillKey: dataset.skillKey,
    slotConfig,
    targetNode,
  };
};

function useSlotConfigState(slotConfig?: readonly SlotConfigType[]): [
  Map<string, SlotConfigType>,
  {
    getSlotValues: () => SlotValues;
    setSlotValues: React.Dispatch<React.SetStateAction<SlotValues>>;
    setSlotConfigMap: (slotConfigs: SlotConfigType[]) => void;
    getNodeInfo: (targetNode: HTMLElement) => NodeInfo | null;
  },
] {
  const [state, _setState] = useState<SlotValues>({});
  const stateRef = useRef<SlotValues>(state);
  const slotConfigMap = useRef<Map<string, SlotConfigType>>(new Map());

  useEffect(() => {
    if (!slotConfig) return;
    const slotValue = buildSlotValues(slotConfig, slotConfigMap);
    _setState(slotValue);
    stateRef.current = slotValue;
  }, [slotConfig]);

  const setState = useCallback((newValue: React.SetStateAction<SlotValues>) => {
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

  const getNodeInfo = useCallback((targetNode: HTMLElement) => {
    return getNodeInfoBySlotConfigMap(targetNode, slotConfigMap.current);
  }, []);
  return [
    slotConfigMap.current,
    { getSlotValues: getState, setSlotValues: setState, setSlotConfigMap, getNodeInfo },
  ];
}

export default useSlotConfigState;
