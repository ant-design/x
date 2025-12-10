const useCursor = () => {
  const getSelection = (): Selection | null => {
    const selection = window.getSelection();
    return selection;
  };

  const getRange = (): { range: Range | null; selection: Selection | null } => {
    const selection = getSelection();
    if (!selection) return { range: null, selection };
    const range = document.createRange();
    return { range, selection };
  };

  const setRange = (range: Range, selection: Selection) => {
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const focus = (selectNode: HTMLDivElement, preventScroll?: boolean) => {
    selectNode.focus({ preventScroll: preventScroll ?? false });
  };

  return {
    setEndCursor: (selectNode: HTMLDivElement, preventScroll?: boolean) => {
      focus(selectNode, preventScroll);
      const { range, selection } = getRange();
      if (range && selection) {
        range.selectNodeContents(selectNode);
        range.collapse(false);
        setRange(range, selection);
      }
    },
    setStartCursor: (selectNode: HTMLDivElement, preventScroll?: boolean) => {
      focus(selectNode, preventScroll);
      const { range, selection } = getRange();
      if (range && selection) {
        range.selectNodeContents(selectNode);
        range.collapse(true);
        setRange(range, selection);
      }
    },
    setAllSelectCursor: (selectNode: HTMLDivElement, preventScroll?: boolean) => {
      focus(selectNode, preventScroll);
      const { range, selection } = getRange();
      if (range && selection) {
        range.selectNodeContents(selectNode);
        setRange(range, selection);
      }
    },
    setCursorPosition: (element: Node, position: number) => {
      // 创建一个range对象

      const range = document.createRange();
      // 设置range的起始点和结束点

      range.setStart(element, position);
      range.setEnd(element, position);

      // 创建一个selection对象
      const selection = window.getSelection();
      if (selection) {
        // 清除之前的selection
        selection.removeAllRanges();
        // 添加新的range到selection
        range.collapse(false);
        selection.addRange(range);
      }
    },
  };
};
