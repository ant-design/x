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

/**
 * 根据 slotConfig 构建 slotValues 对象
 */
const buildSlotValues = (slotConfig: readonly SlotConfigType[]): SlotValues => {
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
    }
    return acc;
  }, {});
};

/**
 * 根据 slotConfig 构建 slotConfigMap
 */
const buildSlotConfigMap = (slotConfig: readonly SlotConfigType[]): Map<string, SlotConfigType> => {
  const map = new Map<string, SlotConfigType>();
  slotConfig?.forEach((node) => {
    if (node.key) {
      map.set(node.key, node);
    }
  });
  return map;
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
    placeholder: dataset.placeholder,
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
    addSlotValuesBySlotConfig: (newSlotConfig: SlotConfigType[]) => void;
    getNodeInfo: (targetNode: HTMLElement) => NodeInfo | null;
  },
] {
  const [state, _setState] = useState<SlotValues>({});
  const stateRef = useRef<SlotValues>(state);
  const slotConfigMap = useRef<Map<string, SlotConfigType>>(new Map());

  useEffect(() => {
    if (!slotConfig) return;
    setSlotValuesBySlotConfig(slotConfig);
  }, [slotConfig]);

  const setState = useCallback((newValue: React.SetStateAction<SlotValues>) => {
    const value = typeof newValue === 'function' ? newValue(stateRef.current) : newValue;
    stateRef.current = value;
    _setState(value);
  }, []);

  const setSlotConfigMap = useCallback((slotConfigs: SlotConfigType[]) => {
    slotConfigMap.current.clear();
    slotConfigs.forEach((config) => {
      if (config.key) {
        slotConfigMap.current.set(config.key, config);
      }
    });
  }, []);

  const setSlotValuesBySlotConfig = useCallback((slotConfig: readonly SlotConfigType[]) => {
    const newSlotConfigMap = buildSlotConfigMap(slotConfig);
    const newSlotValues = buildSlotValues(slotConfig);

    slotConfigMap.current = newSlotConfigMap;
    _setState(newSlotValues);
    stateRef.current = newSlotValues;
  }, []);

  const addSlotValuesBySlotConfig = useCallback((newSlotConfig: SlotConfigType[]) => {
    // 构建新的 slot 配置和值
    const newSlotValues = buildSlotValues(newSlotConfig);
    // 合并新的 slot 配置到现有配置中
    newSlotConfig.forEach((config) => {
      if (config.key) {
        slotConfigMap.current.set(config.key, config);
      }
    });

    _setState((prevState) => ({
      ...prevState,
      ...newSlotValues,
    }));

    stateRef.current = {
      ...stateRef.current,
      ...newSlotValues,
    };
  }, []);

  const getState = useCallback(() => {
    return stateRef.current;
  }, []);

  const getNodeInfo = useCallback((targetNode: HTMLElement) => {
    return getNodeInfoBySlotConfigMap(targetNode, slotConfigMap.current);
  }, []);

  return [
    slotConfigMap.current,
    {
      getSlotValues: getState,
      setSlotValues: setState,
      setSlotConfigMap,
      addSlotValuesBySlotConfig,
      getNodeInfo,
    },
  ];
}

export default useSlotConfigState;
