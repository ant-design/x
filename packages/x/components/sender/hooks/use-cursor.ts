import { useCallback } from 'react';
import warning from '../../_util/warning';
import type { InsertPosition, SlotConfigBaseType } from '../interface';

interface CursorPosition {
  element: Node;
  position: number;
}

interface UseCursorOptions {
  prefixCls: string;
  getSlotDom: (key: string) => HTMLSpanElement | undefined;
  slotConfigMap: Map<string, any>;
  getNodeInfo: (
    element: HTMLElement,
  ) => { slotKey?: string; skillKey?: string; slotConfig?: any; nodeType?: string } | null;
  getEditorValue: () => { value: string; slotConfig: any[]; skill?: any };
}

interface UseCursorReturn {
  setEndCursor: (targetNode: HTMLDivElement | null, preventScroll?: boolean) => void;
  setStartCursor: (targetNode: HTMLDivElement | null, preventScroll?: boolean) => void;
  setAllSelectCursor: (
    targetNode: HTMLDivElement | null,
    skillDom: HTMLSpanElement | null,
    preventScroll?: boolean,
  ) => void;
  setCursorPosition: (
    targetNode: HTMLDivElement | null,
    editableNode: HTMLDivElement | null,
    position: number,
    preventScroll?: boolean,
  ) => { range: Range | null; selection: Selection | null };
  setAfterNodeFocus: (
    targetNode: HTMLDivElement,
    editableNode: HTMLDivElement,
    range: Range | null,
    selection: Selection | null,
    preventScroll?: boolean,
  ) => void;
  setSlotFocus: (
    editableRef: React.RefObject<HTMLDivElement | null>,
    key?: string,
    preventScroll?: boolean,
  ) => void;
  getSelection: () => Selection | null;
  getRange: () => { range: Range | null; selection: Selection | null };
  getTextBeforeCursor: (targetNode: HTMLDivElement | null) => {
    value: string;
    startContainer: Node | null;
    startOffset: number;
  };
  removeAllRanges: () => void;
  getInsertPosition: (
    position?: InsertPosition,
    editableRef?: React.RefObject<HTMLDivElement | null>,
    lastSelectionRef?: React.RefObject<Range | null>,
  ) => {
    type: 'box' | 'slot' | 'end' | 'start';
    slotType?: SlotConfigBaseType['type'];
    range?: Range;
    slotKey?: string;
    selection: Selection | null;
  };
  getEndRange: (editableDom: HTMLDivElement) => Range;
  getStartRange: (editableDom: HTMLDivElement) => Range;
  copySelectionString: () => Promise<boolean>;
  getCleanedText: (ori: string) => string;
}

const useCursor = (options?: UseCursorOptions): UseCursorReturn => {
  const getSelection = useCallback((): Selection | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.getSelection();
  }, []);
  const findOuterContainer = (node: Node, editableDom: HTMLElement): HTMLElement => {
    if (!node || !editableDom) {
      return editableDom;
    }
    let currentNode: Node | null = node;
    let lastSpan: HTMLElement | null = null;

    // 如果当前节点是文本节点，从父节点开始
    if (currentNode.nodeType === Node.TEXT_NODE) {
      currentNode = currentNode.parentElement;
    }

    // 向上遍历DOM树，找到最外层的span元素
    while (currentNode && currentNode !== editableDom) {
      if (currentNode instanceof HTMLElement && currentNode.tagName === 'SPAN') {
        lastSpan = currentNode;
      }
      currentNode = currentNode.parentElement;
    }

    return lastSpan || editableDom;
  };
  const getRange = useCallback((): { range: Range | null; selection: Selection | null } => {
    const selection = getSelection();
    if (!selection) {
      return { range: null, selection };
    }

    try {
      const range = selection.getRangeAt(0) || document.createRange();
      return { range, selection };
    } catch (_error) {
      // 当没有选中范围时创建新的 Range
      const range = document.createRange();
      return { range, selection };
    }
  }, [getSelection]);

  const setRange = useCallback((range: Range, selection: Selection): void => {
    if (!range || !selection) {
      return;
    }

    try {
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (error) {
      warning(false, 'Sender', `Failed to set range: ${error}`);
    }
  }, []);

  const removeAllRanges = useCallback(() => {
    const selection = getSelection();
    if (!selection) {
      return;
    }

    try {
      selection.removeAllRanges();
    } catch (error) {
      warning(false, 'Sender', `Failed to remove all ranges: ${error}`);
    }
  }, [getSelection]);

  const focus = useCallback((targetNode: HTMLDivElement, preventScroll = false): void => {
    if (!targetNode || typeof targetNode.focus !== 'function') {
      return;
    }

    try {
      targetNode.focus({ preventScroll });
    } catch (error) {
      warning(false, 'Sender', `Failed to focus element: ${error}`);
    }
  }, []);

  const setEndCursor: UseCursorReturn['setEndCursor'] = useCallback(
    (targetNode, preventScroll): void => {
      if (!targetNode) {
        return;
      }

      focus(targetNode, preventScroll);
      const { range, selection } = getRange();

      if (range && selection) {
        try {
          range.selectNodeContents(targetNode);
          range.collapse(false);
          setRange(range, selection);
        } catch (error) {
          warning(false, 'Sender', `Failed to set end cursor: ${error}`);
        }
      }
    },
    [focus, getRange, setRange],
  );

  const setStartCursor: UseCursorReturn['setStartCursor'] = useCallback(
    (targetNode, preventScroll): void => {
      if (!targetNode) {
        return;
      }

      focus(targetNode, preventScroll);
      const { range, selection } = getRange();

      if (range && selection) {
        try {
          range.selectNodeContents(targetNode);
          range.collapse(true);
          setRange(range, selection);
        } catch (error) {
          warning(false, 'Sender', `Failed to set start cursor: ${error}`);
        }
      }
    },
    [focus, getRange, setRange],
  );

  const setAllSelectCursor: UseCursorReturn['setAllSelectCursor'] = useCallback(
    (targetNode, skillDom, preventScroll): void => {
      if (!targetNode) {
        return;
      }

      focus(targetNode, preventScroll);
      const { range, selection } = getRange();

      if (range && selection) {
        try {
          range.selectNodeContents(targetNode);
          if (skillDom) {
            range.setStart(targetNode, 1);
          }

          setRange(range, selection);
        } catch (error) {
          warning(false, 'Sender', `Failed to select all content: ${error}`);
        }
      }
    },
    [focus, getRange, setRange],
  );

  const setCursorPosition: UseCursorReturn['setCursorPosition'] = useCallback(
    (targetNode, editableNode, position, preventScroll) => {
      if (!targetNode || typeof position !== 'number' || position < 0 || !editableNode) {
        return { range: null, selection: null };
      }

      focus(editableNode, preventScroll);
      const { range, selection } = getRange();

      if (range && selection) {
        try {
          const maxPosition = Math.min(position, targetNode.childNodes.length);
          range.setStart(targetNode, maxPosition);
          range.setEnd(targetNode, maxPosition);
          range.collapse(false);
          setRange(range, selection);
        } catch (error) {
          warning(false, 'Sender', `Failed to set cursor position:: ${error}`);
        }
      }

      return {
        range: range,
        selection: selection,
      };
    },
    [focus, getRange, setRange],
  );

  const setSlotFocus = useCallback(
    (editableRef: React.RefObject<HTMLDivElement | null>, key?: string, preventScroll = false) => {
      if (!options || !editableRef?.current) return;

      const { getSlotDom, slotConfigMap } = options;

      const getFocusableElement = (slotKey: string): HTMLElement | null => {
        const slotDom = getSlotDom(slotKey);
        if (!slotDom) return null;

        const slotConfig = slotConfigMap.get(slotKey);
        if (!slotConfig) return null;

        // 处理 input 类型的 slot
        if (slotConfig.type === 'input') {
          return (slotDom as Element).querySelector<HTMLInputElement>('input');
        }

        // 处理 content 类型的 slot（排除占位符节点）
        const nodeType = (slotDom as Element)?.getAttribute?.('data-node-type') || '';
        if (slotConfig.type === 'content' && nodeType !== 'nbsp') {
          return slotDom;
        }

        return null;
      };

      const findFocusableSlot = (targetKey?: string): HTMLElement | null => {
        const editor = editableRef.current;
        if (!editor) return null;

        // 如果指定了 key，直接查找对应的 slot
        if (targetKey) {
          return getFocusableElement(targetKey);
        }

        // 否则查找第一个可聚焦的 slot
        for (const node of Array.from(editor.childNodes)) {
          const slotKey = (node as Element)?.getAttribute?.('data-slot-key');
          if (slotKey) {
            const focusableElement = getFocusableElement(slotKey);
            if (focusableElement) {
              return focusableElement;
            }
          }
        }

        return null;
      };

      const targetElement = findFocusableSlot(key);
      if (!targetElement) return;

      if (targetElement.nodeName === 'INPUT') {
        (targetElement as HTMLInputElement).focus({ preventScroll });
      } else {
        setCursorPosition(targetElement as HTMLDivElement, editableRef.current, 0, preventScroll);
      }
    },
    [options, setCursorPosition],
  );

  const setAfterNodeFocus: UseCursorReturn['setAfterNodeFocus'] = useCallback(
    (targetNode, editableNode, range, selection, preventScroll) => {
      if (!range || !selection) return;
      focus(editableNode, preventScroll);
      range?.setStartAfter(targetNode);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    },
    [focus],
  );

  const getTextBeforeCursor = useCallback(
    (targetNode: HTMLDivElement | null) => {
      // 快速路径：空节点直接返回
      if (!targetNode) {
        return { value: '', startContainer: null, startOffset: 0 };
      }

      const selection = getSelection();
      if (!selection || selection.rangeCount === 0) {
        return { value: '', startContainer: null, startOffset: 0 };
      }

      try {
        let range = selection.getRangeAt(0);
        let cloneRange = range.cloneRange();
        // 验证光标位置是否在目标节点内
        if (!targetNode.contains(range.startContainer)) {
          return { value: '', startContainer: null, startOffset: 0 };
        }

        if (range.endContainer === targetNode) {
          if (range.endContainer.lastChild?.nodeType === Node.TEXT_NODE) {
            const lastDom = range.endContainer.lastChild as Text;
            range = document.createRange();
            range.setStart(lastDom, lastDom.length);
            range.setEnd(lastDom, lastDom.length);
          }
        }
        cloneRange = range.cloneRange();
        cloneRange.selectNodeContents(targetNode);
        cloneRange.setEnd(range.startContainer, range.startOffset);

        // 清理并返回结果
        const value = cloneRange.toString().replace(/\u200B/g, ''); // 移除零宽空格

        return {
          value,
          startContainer: range.startContainer,
          startOffset: range.startOffset,
        };
      } catch (error) {
        warning(false, 'Sender', `Failed to get text before cursor: ${error}`);
        return { value: '', startContainer: null, startOffset: 0 };
      }
    },
    [getSelection],
  );

  /**
   * 获取插入位置信息
   * @param position - 插入位置类型：'cursor' | 'end' | 'start'
   * @returns 包含插入类型和对应 range 的对象
   */
  const getInsertPosition: UseCursorReturn['getInsertPosition'] = useCallback(
    (
      position?: InsertPosition,
      editableRef?: React.RefObject<HTMLDivElement | null>,
      lastSelectionRef?: React.RefObject<Range | null>,
    ) => {
      if (position === 'start' || position === 'end') {
        return { type: position, selection: getSelection() };
      }

      let range: Range | null = null;
      let selection: Selection | null = null;

      if (lastSelectionRef?.current) {
        range = lastSelectionRef.current;
        selection = getSelection();
      } else {
        const rangeResult = getRange();
        range = rangeResult.range;
        selection = rangeResult.selection;
      }

      if (!range || !selection) {
        return { type: 'end', selection };
      }

      const editableDom = editableRef?.current;
      if (!editableDom) {
        return { type: 'end', selection };
      }

      // 检查是否在可编辑区域内，如果不在则设置对应的光标位置
      const isEndInEditableBox = editableDom.contains(range.endContainer);
      const isStartInEditableBox = editableDom.contains(range.startContainer);

      if (!isEndInEditableBox) {
        setEndCursor(editableDom, true);
        return { type: 'end', selection };
      }

      if (!isStartInEditableBox) {
        setStartCursor(editableDom, true);
        return { type: 'start', selection };
      }

      // 获取容器信息
      const endContainer = findOuterContainer(range.endContainer, editableDom);
      const startContainer = findOuterContainer(range.startContainer, editableDom);

      // 检查是否是 slot 类型
      if (
        endContainer === startContainer &&
        startContainer !== editableDom &&
        options?.getNodeInfo
      ) {
        const { slotKey, slotConfig, skillKey } = options.getNodeInfo(endContainer) || {};
        if (slotKey) {
          return {
            type: 'slot',
            slotKey: slotConfig?.key,
            slotType: slotConfig?.type,
            range,
            selection,
          };
        }
        if (skillKey) {
          return { type: 'start', selection };
        }
      }

      // 在可编辑区域内但不是 slot，返回 box
      return { type: 'box', range, selection };
    },
    [options, getRange, getSelection, setEndCursor, setStartCursor, findOuterContainer],
  );

  /**
   * 获取末尾插入范围
   */
  const getEndRange: UseCursorReturn['getEndRange'] = useCallback(
    (editableDom: HTMLDivElement): Range => {
      const lastNode = editableDom.childNodes[editableDom.childNodes.length - 1];
      const targetIndex =
        lastNode?.nodeType === Node.TEXT_NODE && lastNode.textContent === '\n'
          ? editableDom.childNodes.length - 1
          : editableDom.childNodes.length;

      const result = setCursorPosition(editableDom, editableDom, targetIndex);
      return result.range || document.createRange();
    },
    [setCursorPosition],
  );

  /**
   * 获取开头插入范围
   */
  const getStartRange: UseCursorReturn['getStartRange'] = useCallback(
    (editableDom: HTMLDivElement): Range => {
      const startIndex = options?.getEditorValue?.().skill ? 1 : 0;
      const result = setCursorPosition(editableDom, editableDom, startIndex);
      return result.range || document.createRange();
    },
    [setCursorPosition, options],
  );

  const getCleanedText = useCallback((ori: string) => {
    return ori
      .replace(/\u200B/g, '') // 移除零宽空格
      .replace(/\n/g, '')
      .replace(/^\n+|\n+$/g, ''); // 移除开头和结尾的换行
  }, []);

  const copySelectionString = useCallback(async (): Promise<boolean> => {
    try {
      const selection = getSelection();
      if (!selection) {
        return false;
      }

      const selectingString = selection.toString();
      if (!selectingString) {
        return false;
      }
      const cleanedText = getCleanedText(selectingString);
      await navigator.clipboard.writeText(cleanedText);
      return true;
    } catch (error) {
      warning(false, 'Sender', `Failed to copy selection: ${error}`);
      return false;
    }
  }, [getSelection, getCleanedText]);

  return {
    setEndCursor,
    setStartCursor,
    setAllSelectCursor,
    setCursorPosition,
    setAfterNodeFocus,
    setSlotFocus,
    getTextBeforeCursor,
    getSelection,
    removeAllRanges,
    getRange,
    getInsertPosition,
    getEndRange,
    getStartRange,
    copySelectionString,
    getCleanedText,
  };
};

export default useCursor;
export type { CursorPosition, UseCursorReturn, UseCursorOptions };
