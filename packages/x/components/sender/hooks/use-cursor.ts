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

  return {
    setEndCursor: (selectNode: HTMLDivElement) => {
      const { range, selection } = getRange();
      if (range && selection) {
        range.selectNodeContents(selectNode);
        range.collapse(false);
        setRange(range, selection);
      }
    },
    setStartCursor: (selectNode: HTMLDivElement) => {
      const { range, selection } = getRange();
      if (range && selection) {
        range.selectNodeContents(selectNode);
        range.collapse(true);
        setRange(range, selection);
      }
    },
    setAllSelectCursor: (selectNode: HTMLDivElement) => {
      const { range, selection } = getRange();
      if (range && selection) {
        range.selectNodeContents(selectNode);
        setRange(range, selection);
      }
    },
  };
};
