import { useCallback } from 'react';
import warning from '../../_util/warning';

interface CursorPosition {
  element: Node;
  position: number;
}

interface UseCursorOptions {
  prefixCls: string;
  getSlotDom: (key: string) => HTMLSpanElement | undefined;
  slotConfigMap: Map<string, any>;
}

interface UseCursorReturn {
  setEndCursor: (targetNode: HTMLDivElement | null, preventScroll?: boolean) => void;
  setStartCursor: (targetNode: HTMLDivElement | null, preventScroll?: boolean) => void;
  setAllSelectCursor: (targetNode: HTMLDivElement | null, preventScroll?: boolean) => void;
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
}

const useCursor = (options?: UseCursorOptions): UseCursorReturn => {
  const getSelection = useCallback((): Selection | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.getSelection();
  }, []);

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
    (targetNode, preventScroll): void => {
      if (!targetNode) {
        return;
      }

      focus(targetNode, preventScroll);
      const { range, selection } = getRange();

      if (range && selection) {
        try {
          range.selectNodeContents(targetNode);
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
        const range = selection.getRangeAt(0);

        // 验证光标位置是否在目标节点内
        if (!targetNode.contains(range.startContainer)) {
          return { value: '', startContainer: null, startOffset: 0 };
        }

        const clone = range.cloneRange();
        clone.selectNodeContents(targetNode);
        clone.setEnd(range.startContainer, range.startOffset);

        // 清理并返回结果
        const value = clone.toString().replace(/\u200B/g, ''); // 移除零宽空格

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

  return {
    setEndCursor,
    setStartCursor,
    setAllSelectCursor,
    setCursorPosition,
    setAfterNodeFocus,
    setSlotFocus,
    getTextBeforeCursor,
    getSelection,
    getRange,
  };
};

export default useCursor;
export type { CursorPosition, UseCursorReturn, UseCursorOptions };
