import { useCallback } from 'react';

interface CursorPosition {
  element: Node;
  position: number;
}

interface UseCursorReturn {
  setEndCursor: (selectNode: HTMLDivElement, preventScroll?: boolean) => void;
  setStartCursor: (selectNode: HTMLDivElement, preventScroll?: boolean) => void;
  setAllSelectCursor: (selectNode: HTMLDivElement, preventScroll?: boolean) => void;
  setCursorPosition: (element: Node, position: number) => void;
  getSelection: () => Selection | null;
  getRange: () => { range: Range | null; selection: Selection | null };
}

const useCursor = (): UseCursorReturn => {
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
    } catch (error) {
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
      console.warn('Failed to set range:', error);
    }
  }, []);

  const focus = useCallback((selectNode: HTMLDivElement, preventScroll = false): void => {
    if (!selectNode || typeof selectNode.focus !== 'function') {
      return;
    }

    try {
      selectNode.focus({ preventScroll });
    } catch (error) {
      console.warn('Failed to focus element:', error);
    }
  }, []);

  const setEndCursor = useCallback(
    (selectNode: HTMLDivElement, preventScroll?: boolean): void => {
      if (!selectNode) {
        return;
      }

      focus(selectNode, preventScroll);
      const { range, selection } = getRange();

      if (range && selection) {
        try {
          range.selectNodeContents(selectNode);
          range.collapse(false);
          setRange(range, selection);
        } catch (error) {
          console.warn('Failed to set end cursor:', error);
        }
      }
    },
    [focus, getRange, setRange],
  );

  const setStartCursor = useCallback(
    (selectNode: HTMLDivElement, preventScroll?: boolean): void => {
      if (!selectNode) {
        return;
      }

      focus(selectNode, preventScroll);
      const { range, selection } = getRange();

      if (range && selection) {
        try {
          range.selectNodeContents(selectNode);
          range.collapse(true);
          setRange(range, selection);
        } catch (error) {
          console.warn('Failed to set start cursor:', error);
        }
      }
    },
    [focus, getRange, setRange],
  );

  const setAllSelectCursor = useCallback(
    (selectNode: HTMLDivElement, preventScroll?: boolean): void => {
      if (!selectNode) {
        return;
      }

      focus(selectNode, preventScroll);
      const { range, selection } = getRange();

      if (range && selection) {
        try {
          range.selectNodeContents(selectNode);
          setRange(range, selection);
        } catch (error) {
          console.warn('Failed to select all content:', error);
        }
      }
    },
    [focus, getRange, setRange],
  );

  const setCursorPosition = useCallback(
    (element: Node, position: number): void => {
      if (!element || typeof position !== 'number' || position < 0) {
        return;
      }

      const { range, selection } = getRange();

      if (range && selection) {
        try {
          const maxPosition = Math.min(position, element.textContent?.length || 0);
          range.setStart(element, maxPosition);
          range.setEnd(element, maxPosition);
          range.collapse(false);
          setRange(range, selection);
        } catch (error) {
          console.warn('Failed to set cursor position:', error);
        }
      }
    },
    [getRange, setRange],
  );

  return {
    setEndCursor,
    setStartCursor,
    setAllSelectCursor,
    setCursorPosition,
    getSelection,
    getRange,
  };
};

export default useCursor;
export type { CursorPosition, UseCursorReturn };
