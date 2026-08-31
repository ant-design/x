import { useCallback, useEffect, useRef, useState } from 'react';
import type { SlotConfigType } from '../interface';

interface NodeInfo {
  slotKey?: string;
  nodeType?: 'nbsp';
  skillKey?: string;
  slotConfig?: SlotConfigType;
  placeholder?: string;
  targetNode: HTMLElement;
}

type SlotValues = Record<string, any>;

// 支持的输入类型集合
const SUPPORTED_INPUT_TYPES = new Set(['input', 'select', 'custom', 'content']);

/**
 * 从 slot 配置中提取默认值构建 slotValues
 */
const buildSlotValues = (slotConfig: readonly SlotConfigType[]): SlotValues =>
  slotConfig?.reduce<SlotValues>((acc, node) => {
    const { key, type } = node;
    if (!key) return acc;

    const props = (node as any).props || {};
    const defaultValue = SUPPORTED_INPUT_TYPES.has(type)
      ? props.defaultValue
      : (props.value ?? props.label);

    acc[key] = defaultValue ?? '';
    return acc;
  }, {}) ?? {};

/**
 * 将 slot 配置数组转换为 Map 结构便于查找
 */
const buildSlotConfigMap = (
  slotConfig: readonly SlotConfigType[],
  slotConfigMap: Map<string, SlotConfigType>,
) => {
  slotConfig?.forEach((node) => {
    if (node.key) slotConfigMap.set(node.key, node);
  });
};

/**
 * 根据目标节点和配置映射获取节点信息
 */
const getNodeInfoBySlotConfigMap = (
  targetNode: HTMLElement,
  slotConfigMap: Map<string, SlotConfigType>,
): NodeInfo | null => {
  if (!targetNode?.dataset) return null;
  const { dataset } = targetNode;
  return {
    slotKey: dataset.slotKey,
    placeholder: dataset.placeholder,
    nodeType: dataset.nodeType as 'nbsp' | undefined,
    skillKey: dataset.skillKey,
    slotConfig: dataset.slotKey ? slotConfigMap.get(dataset.slotKey) : undefined,
    targetNode,
  };
};

const useSlotConfigState = (
  slotConfig?: readonly SlotConfigType[],
): [
  Map<string, SlotConfigType>,
  {
    getSlotValues: () => SlotValues;
    setSlotValues: React.Dispatch<React.SetStateAction<SlotValues>>;
    mergeSlotConfig: (newSlotConfig: SlotConfigType[]) => void;
    getNodeInfo: (targetNode: HTMLElement) => NodeInfo | null;
    getNodeTextValue: (node: Node) => string;
    clear: () => void;
  },
] => {
  const [state, _setState] = useState<SlotValues>({});
  const stateRef = useRef<SlotValues>(state);
  const slotConfigMapRef = useRef<Map<string, SlotConfigType>>(new Map());
  // Track keys inserted at runtime via mergeSlotConfig so the slotConfig effect below
  // can preserve them when the prop reference changes (e.g. parent re-renders with an
  // inline `[]`); otherwise ref.insert(...) entries silently disappear from getValue().
  //
  // Grows monotonically until clear(); intentional, the residual cost is one string
  // per ever-inserted key.
  const runtimeKeysRef = useRef<Set<string>>(new Set());

  // 初始化 slotConfig
  useEffect(() => {
    if (!slotConfig) return;
    slotConfigMapRef.current.forEach((_, key) => {
      if (!runtimeKeysRef.current.has(key)) slotConfigMapRef.current.delete(key);
    });

    buildSlotConfigMap(slotConfig, slotConfigMapRef.current);

    const newValues = buildSlotValues(slotConfig);
    runtimeKeysRef.current.forEach((key) => {
      if (key in stateRef.current) newValues[key] = stateRef.current[key];
    });
    _setState(newValues);
    stateRef.current = newValues;
  }, [slotConfig]);

  const setState = useCallback((newValue: React.SetStateAction<SlotValues>) => {
    const value = typeof newValue === 'function' ? newValue(stateRef.current) : newValue;
    _setState(value);
    stateRef.current = value;
  }, []);

  const mergeSlotConfig = useCallback((newSlotConfig: SlotConfigType[]) => {
    const newValues = buildSlotValues(newSlotConfig);

    newSlotConfig.forEach((node) => {
      if (node.key) {
        slotConfigMapRef.current.set(node.key, node);
        runtimeKeysRef.current.add(node.key);
      }
    });

    _setState((prev) => ({ ...prev, ...newValues }));
    stateRef.current = { ...stateRef.current, ...newValues };
  }, []);

  const clear = useCallback(() => {
    slotConfigMapRef.current.clear();
    runtimeKeysRef.current.clear();
    _setState({});
    stateRef.current = {};
  }, []);

  const getNodeInfo = useCallback(
    (targetNode: HTMLElement) => getNodeInfoBySlotConfigMap(targetNode, slotConfigMapRef.current),
    [],
  );

  const getNodeTextValue = (node: Node): string => {
    const nodeType = node.nodeType;

    if (nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const element = node as HTMLElement;
    const nodeInfo = getNodeInfo(element);

    // 无节点信息，直接返回文本内容
    if (!nodeInfo) {
      return element.innerText || '';
    }

    const { slotKey, skillKey, nodeType: infoNodeType, slotConfig } = nodeInfo;
    if (skillKey) {
      return '';
    }

    // 缓存文本内容，避免重复获取
    const textContent = element.innerText || '';

    // 处理 slot 节点
    if (slotKey) {
      if (infoNodeType === 'nbsp') {
        return ' ';
      }
      if (!slotConfig) {
        return textContent;
      }
      // content 类型的值来自 DOM 文本（用户可在 contenteditable 区域直接编辑），
      // 其他类型的值来自 state。
      const slotValue =
        slotConfig.type === 'content' ? textContent : (stateRef.current[slotKey] ?? '');
      return slotConfig.formatResult?.(slotValue) ?? slotValue;
    }

    return textContent;
  };

  return [
    slotConfigMapRef.current,
    {
      getSlotValues: () => stateRef.current,
      setSlotValues: setState,
      mergeSlotConfig,
      getNodeInfo,
      getNodeTextValue,
      clear,
    },
  ];
};

export default useSlotConfigState;
