import clsx from 'clsx';
import { useCallback } from 'react';
import type { SlotConfigBaseType, SlotConfigType } from '../interface';

interface UseSlotBuilderOptions {
  prefixCls: string;
  placeholder?: string;
  slotDomMap: React.RefObject<Map<string, HTMLSpanElement>>;
  slotConfigMap: Map<string, SlotConfigBaseType>;
}

interface UseSlotBuilderReturn {
  buildSkillSpan: (key: string) => HTMLSpanElement;
  buildEditSlotSpan: (config: SlotConfigType) => HTMLSpanElement;
  buildSlotSpan: (key: string) => HTMLSpanElement;
  buildSpaceSpan: (slotKey: string, positions: 'before' | 'after') => HTMLSpanElement;
  saveSlotDom: (key: string, dom: HTMLSpanElement) => void;
  getSlotDom: (key: string) => HTMLSpanElement | undefined;
  getSlotLastDom: (
    slotKey: string,
    slotType?: SlotConfigBaseType['type'],
  ) => HTMLSpanElement | undefined;
}

const useSlotBuilder = (options: UseSlotBuilderOptions): UseSlotBuilderReturn => {
  const { prefixCls, placeholder, slotDomMap, slotConfigMap } = options;

  /**
   * 创建技能span元素
   * 用于创建技能输入区域
   */
  const buildSkillSpan = useCallback(
    (key: string): HTMLSpanElement => {
      const span = document.createElement('span');
      span.setAttribute('contenteditable', 'false');
      span.dataset.skillKey = key;
      span.dataset.placeholder = placeholder || '';
      span.className = `${prefixCls}-skill`;
      return span;
    },
    [prefixCls, placeholder],
  );

  /**
   * 创建可编辑的slot span元素
   * 用于content类型的slot
   */
  const buildEditSlotSpan = useCallback(
    (config: SlotConfigType): HTMLSpanElement => {
      const span = document.createElement('span');
      span.setAttribute('contenteditable', 'true');
      span.dataset.slotKey = config.key;
      span.className = clsx(`${prefixCls}-slot`, `${prefixCls}-slot-content`);
      return span;
    },
    [prefixCls],
  );

  /**
   * 创建不可编辑的slot span元素
   * 用于普通slot
   */
  const buildSlotSpan = useCallback(
    (key: string): HTMLSpanElement => {
      const span = document.createElement('span');
      span.setAttribute('contenteditable', 'false');
      span.dataset.slotKey = key;
      span.className = `${prefixCls}-slot`;
      return span;
    },
    [prefixCls],
  );

  /**
   * 创建占位符span元素
   * 用于slot的前后占位
   */
  const buildSpaceSpan = useCallback(
    (slotKey: string, positions: 'before' | 'after'): HTMLSpanElement => {
      const span = document.createElement('span');
      span.setAttribute('contenteditable', 'false');
      span.dataset.slotKey = slotKey;
      span.dataset.nodeType = 'nbsp';
      span.className = clsx(`${prefixCls}-slot-${positions}`, `${prefixCls}-slot-no-width`);
      span.textContent = '\u00A0';
      return span;
    },
    [prefixCls],
  );

  const saveSlotDom = (key: string, dom: HTMLSpanElement) => {
    slotDomMap.current.set(key, dom);
  };

  const getSlotDom = (key: string): HTMLSpanElement | undefined => {
    return slotDomMap.current.get(key);
  };
  const getSlotLastDom = (slotKey: string, slotType?: SlotConfigBaseType['type']) => {
    const mergeSlotType = slotType ?? slotConfigMap.get(slotKey)?.type;
    if (mergeSlotType === 'content') {
      return getSlotDom(`${slotKey}_after`);
    }
    return getSlotDom(slotKey);
  };

  return {
    buildSkillSpan,
    buildEditSlotSpan,
    buildSlotSpan,
    buildSpaceSpan,
    saveSlotDom,
    getSlotDom,
    getSlotLastDom,
  };
};

export default useSlotBuilder;
export type { UseSlotBuilderOptions, UseSlotBuilderReturn };
