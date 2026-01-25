import { act, renderHook } from '@testing-library/react';
import useCursor from '../hooks/use-cursor';

describe('useCursor', () => {
  let mockGetSlotDom: jest.Mock;
  let mockSlotConfigMap: Map<string, any>;
  let mockGetNodeInfo: jest.Mock;
  let mockGetEditorValue: jest.Mock;

  beforeEach(() => {
    mockGetSlotDom = jest.fn();
    mockSlotConfigMap = new Map();
    mockGetNodeInfo = jest.fn();
    mockGetEditorValue = jest.fn();

    // Mock DOM APIs
    Object.defineProperty(window, 'getSelection', {
      value: jest.fn(),
      writable: true,
    });

    const mockRange = {
      setStart: jest.fn(),
      setEnd: jest.fn(),
      collapse: jest.fn(),
      selectNodeContents: jest.fn(),
      setStartAfter: jest.fn(),
      setEndAfter: jest.fn(),
      cloneRange: jest.fn(() => ({
        selectNodeContents: jest.fn(),
        setEnd: jest.fn(),
        toString: jest.fn(),
        commonAncestorContainer: document.createElement('div'),
        cloneContents: jest.fn(),
        compareBoundaryPoints: jest.fn(),
        comparePoint: jest.fn(),
        deleteContents: jest.fn(),
        extractContents: jest.fn(),
        insertNode: jest.fn(),
        surroundContents: jest.fn(),
        detach: jest.fn(),
        END_TO_END: 2,
        END_TO_START: 3,
        START_TO_END: 1,
        START_TO_START: 0,
      })),
      toString: jest.fn(),
      commonAncestorContainer: document.createElement('div'),
      cloneContents: jest.fn(),
      compareBoundaryPoints: jest.fn(),
      comparePoint: jest.fn(),
      deleteContents: jest.fn(),
      extractContents: jest.fn(),
      insertNode: jest.fn(),
      surroundContents: jest.fn(),
      detach: jest.fn(),
      END_TO_END: 2,
      END_TO_START: 3,
      START_TO_END: 1,
      START_TO_START: 0,
    };

    Object.defineProperty(document, 'createRange', {
      value: jest.fn(() => mockRange),
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSelection', () => {
    it('should return null when window is undefined', () => {
      const { result } = renderHook(() => useCursor());

      // Temporarily remove window
      const originalWindow = global.window;
      delete (global as any).window;

      expect(result.current.getSelection()).toBeNull();

      // Restore window
      global.window = originalWindow;
    });

    it('should return selection when window is defined', () => {
      const mockSelection = { removeAllRanges: jest.fn() };
      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const { result } = renderHook(() => useCursor());
      expect(result.current.getSelection()).toBe(mockSelection);
    });
  });

  describe('getRange', () => {
    it('should return null range when no selection', () => {
      (window.getSelection as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() => useCursor());
      const { range, selection } = result.current.getRange();

      expect(range).toBeNull();
      expect(selection).toBeNull();
    });

    it('should return range from selection', () => {
      const mockRange = { collapse: jest.fn() };
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockReturnValue(mockRange),
      };
      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const { result } = renderHook(() => useCursor());
      const { range, selection } = result.current.getRange();

      expect(range).toBe(mockRange);
      expect(selection).toBe(mockSelection);
    });

    it('should create new range when getRangeAt throws error', () => {
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockImplementation(() => {
          throw new Error('No range');
        }),
      };
      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const { result } = renderHook(() => useCursor());
      const { range, selection } = result.current.getRange();

      expect(range).toBeDefined();
      expect(selection).toBe(mockSelection);
    });
  });

  describe('cursor positioning methods', () => {
    let mockTargetNode: HTMLDivElement;
    let mockEditableNode: HTMLDivElement;

    beforeEach(() => {
      mockTargetNode = document.createElement('div');
      mockEditableNode = document.createElement('div');

      mockTargetNode.focus = jest.fn();
      mockEditableNode.focus = jest.fn();
    });

    describe('setEndCursor', () => {
      it('should handle null target node', () => {
        const { result } = renderHook(() => useCursor());

        act(() => {
          result.current.setEndCursor(null);
        });

        // Should not throw
      });

      it('should set cursor at end', () => {
        const mockRange = {
          selectNodeContents: jest.fn(),
          collapse: jest.fn(),
        };
        const mockSelection = { removeAllRanges: jest.fn(), addRange: jest.fn() };

        (window.getSelection as jest.Mock).mockReturnValue(mockSelection);
        (document.createRange as jest.Mock).mockReturnValue(mockRange);

        const { result } = renderHook(() => useCursor());

        act(() => {
          result.current.setEndCursor(mockTargetNode);
        });

        expect(mockTargetNode.focus).toHaveBeenCalled();
        expect(mockRange.selectNodeContents).toHaveBeenCalledWith(mockTargetNode);
        expect(mockRange.collapse).toHaveBeenCalledWith(false);
      });

      it('should handle errors gracefully', () => {
        const mockRange = {
          selectNodeContents: jest.fn().mockImplementation(() => {
            throw new Error('Test error');
          }),
          collapse: jest.fn(),
        };
        const mockSelection = { removeAllRanges: jest.fn(), addRange: jest.fn() };

        (window.getSelection as jest.Mock).mockReturnValue(mockSelection);
        (document.createRange as jest.Mock).mockReturnValue(mockRange);

        const { result } = renderHook(() => useCursor());

        act(() => {
          expect(() => result.current.setEndCursor(mockTargetNode)).not.toThrow();
        });
      });
    });

    describe('setStartCursor', () => {
      it('should set cursor at start', () => {
        const mockRange = {
          selectNodeContents: jest.fn(),
          collapse: jest.fn(),
        };
        const mockSelection = { removeAllRanges: jest.fn(), addRange: jest.fn() };

        (window.getSelection as jest.Mock).mockReturnValue(mockSelection);
        (document.createRange as jest.Mock).mockReturnValue(mockRange);

        const { result } = renderHook(() => useCursor());

        act(() => {
          result.current.setStartCursor(mockTargetNode);
        });

        expect(mockRange.collapse).toHaveBeenCalledWith(true);
      });
    });

    describe('setAllSelectCursor', () => {
      it('should select all content', () => {
        const mockRange = {
          selectNodeContents: jest.fn(),
          setStart: jest.fn(),
        };
        const mockSelection = { removeAllRanges: jest.fn(), addRange: jest.fn() };
        const mockSkillDom = document.createElement('span');

        (window.getSelection as jest.Mock).mockReturnValue(mockSelection);
        (document.createRange as jest.Mock).mockReturnValue(mockRange);

        const { result } = renderHook(() => useCursor());

        act(() => {
          result.current.setAllSelectCursor(mockTargetNode, mockSkillDom);
        });

        expect(mockRange.selectNodeContents).toHaveBeenCalledWith(mockTargetNode);
        expect(mockRange.setStart).toHaveBeenCalledWith(mockTargetNode, 1);
      });

      it('should handle null skillDom', () => {
        const mockRange = {
          selectNodeContents: jest.fn(),
          setStart: jest.fn(),
        };
        const mockSelection = { removeAllRanges: jest.fn(), addRange: jest.fn() };

        (window.getSelection as jest.Mock).mockReturnValue(mockSelection);
        (document.createRange as jest.Mock).mockReturnValue(mockRange);

        const { result } = renderHook(() => useCursor());

        act(() => {
          result.current.setAllSelectCursor(mockTargetNode, null);
        });

        expect(mockRange.setStart).not.toHaveBeenCalled();
      });
    });

    describe('setCursorPosition', () => {
      it('should handle invalid position', () => {
        const { result } = renderHook(() => useCursor());

        const { range, selection } = result.current.setCursorPosition(
          mockTargetNode,
          mockEditableNode,
          -1,
        );

        expect(range).toBeNull();
        expect(selection).toBeNull();
      });

      it('should handle null target node', () => {
        const { result } = renderHook(() => useCursor());

        const { range, selection } = result.current.setCursorPosition(null, mockEditableNode, 5);

        expect(range).toBeNull();
        expect(selection).toBeNull();
      });

      it('should set cursor position correctly', () => {
        const mockRange = {
          setStart: jest.fn(),
          setEnd: jest.fn(),
          collapse: jest.fn(),
        };
        const mockSelection = { removeAllRanges: jest.fn(), addRange: jest.fn() };

        (window.getSelection as jest.Mock).mockReturnValue(mockSelection);
        (document.createRange as jest.Mock).mockReturnValue(mockRange);

        Object.defineProperty(mockTargetNode, 'childNodes', {
          value: [document.createTextNode('test')],
          writable: true,
        });

        const { result } = renderHook(() => useCursor());

        result.current.setCursorPosition(mockTargetNode, mockEditableNode, 2);

        expect(mockRange.setStart).toHaveBeenCalledWith(mockTargetNode, 1);
        expect(mockRange.setEnd).toHaveBeenCalledWith(mockTargetNode, 1);
        expect(mockRange.collapse).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('getTextBeforeCursor', () => {
    it('should handle null target node', () => {
      const { result } = renderHook(() => useCursor());

      const { value, startContainer, startOffset } = result.current.getTextBeforeCursor(null);

      expect(value).toBe('');
      expect(startContainer).toBeNull();
      expect(startOffset).toBe(0);
    });

    it('should handle no selection', () => {
      (window.getSelection as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() => useCursor());
      const mockTargetNode = document.createElement('div');

      const { value } = result.current.getTextBeforeCursor(mockTargetNode);
      expect(value).toBe('');
    });

    it('should handle cursor outside target node', () => {
      const mockRange = {
        startContainer: document.createElement('div'),
        startOffset: 0,
        cloneRange: jest.fn().mockReturnValue({
          selectNodeContents: jest.fn(),
          setEnd: jest.fn(),
          toString: jest.fn().mockReturnValue('test'),
        }),
      };
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockReturnValue(mockRange),
      };

      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const { result } = renderHook(() => useCursor());
      const mockTargetNode = document.createElement('div');

      const { value } = result.current.getTextBeforeCursor(mockTargetNode);
      expect(value).toBe('');
    });

    it('should get text before cursor correctly', () => {
      const mockTextNode = document.createTextNode('hello world');
      const mockRange = {
        startContainer: mockTextNode,
        startOffset: 5,
        cloneRange: jest.fn().mockReturnValue({
          selectNodeContents: jest.fn(),
          setEnd: jest.fn(),
          toString: jest.fn().mockReturnValue('hello'),
        }),
      };
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockReturnValue(mockRange),
      };

      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const { result } = renderHook(() => useCursor());
      const mockTargetNode = document.createElement('div');
      mockTargetNode.appendChild(mockTextNode);

      const { value } = result.current.getTextBeforeCursor(mockTargetNode);
      expect(value).toBe('hello');
    });

    it('should handle errors gracefully', () => {
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockImplementation(() => {
          throw new Error('Test error');
        }),
      };

      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const { result } = renderHook(() => useCursor());
      const mockTargetNode = document.createElement('div');

      const { value } = result.current.getTextBeforeCursor(mockTargetNode);
      expect(value).toBe('');
    });

    it('should handle zero-width space in text', () => {
      const mockTextNode = document.createTextNode('hello\u200Bworld');
      const mockRange = {
        startContainer: mockTextNode,
        startOffset: 5,
        cloneRange: jest.fn().mockReturnValue({
          selectNodeContents: jest.fn(),
          setEnd: jest.fn(),
          toString: jest.fn().mockReturnValue('hello\u200B'),
        }),
      };
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockReturnValue(mockRange),
      };

      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const { result } = renderHook(() => useCursor());
      const mockTargetNode = document.createElement('div');
      mockTargetNode.appendChild(mockTextNode);

      const { value } = result.current.getTextBeforeCursor(mockTargetNode);
      expect(value).toBe('hello');
    });
  });

  describe('removeAllRanges', () => {
    it('should handle null selection', () => {
      (window.getSelection as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() => useCursor());

      act(() => {
        result.current.removeAllRanges();
      });

      // Should not throw
    });

    it('should remove all ranges', () => {
      const mockSelection = { removeAllRanges: jest.fn() };
      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const { result } = renderHook(() => useCursor());

      act(() => {
        result.current.removeAllRanges();
      });

      expect(mockSelection.removeAllRanges).toHaveBeenCalled();
    });

    it('should handle errors gracefully', () => {
      const mockSelection = {
        removeAllRanges: jest.fn().mockImplementation(() => {
          throw new Error('Test error');
        }),
      };
      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const { result } = renderHook(() => useCursor());

      act(() => {
        expect(() => result.current.removeAllRanges()).not.toThrow();
      });
    });
  });

  describe('setSlotFocus', () => {
    it('should handle missing options', () => {
      const { result } = renderHook(() => useCursor());
      const mockRef = { current: document.createElement('div') };

      act(() => {
        result.current.setSlotFocus(mockRef as any, 'test-key');
      });

      // Should not throw when options is undefined
    });

    it('should handle null editable ref', () => {
      const options = {
        prefixCls: 'test',
        getSlotDom: mockGetSlotDom,
        slotConfigMap: mockSlotConfigMap,
        getNodeInfo: mockGetNodeInfo,
        getEditorValue: mockGetEditorValue,
      };

      const { result } = renderHook(() => useCursor(options));
      const mockRef = { current: null };

      act(() => {
        result.current.setSlotFocus(mockRef as any, 'test-key');
      });

      // Should not throw
    });

    it('should focus input slot', () => {
      const options = {
        prefixCls: 'test',
        getSlotDom: mockGetSlotDom,
        slotConfigMap: mockSlotConfigMap,
        getNodeInfo: mockGetNodeInfo,
        getEditorValue: mockGetEditorValue,
      };

      const mockSlotDom = document.createElement('span');
      const mockInput = document.createElement('input');
      mockSlotDom.appendChild(mockInput);

      mockGetSlotDom.mockReturnValue(mockSlotDom as any);
      mockSlotConfigMap.set('test-key', { type: 'input' });

      const { result } = renderHook(() => useCursor(options));
      const mockRef = { current: document.createElement('div') };

      act(() => {
        result.current.setSlotFocus(mockRef as any, 'test-key');
      });

      expect(mockGetSlotDom).toHaveBeenCalledWith('test-key');
    });

    it('should focus content slot', () => {
      const options = {
        prefixCls: 'test',
        getSlotDom: mockGetSlotDom,
        slotConfigMap: mockSlotConfigMap,
        getNodeInfo: mockGetNodeInfo,
        getEditorValue: mockGetEditorValue,
      };

      const mockSlotDom = document.createElement('span');
      mockSlotDom.setAttribute('data-node-type', 'content');

      mockGetSlotDom.mockReturnValue(mockSlotDom as any);
      mockSlotConfigMap.set('test-key', { type: 'content' });

      const { result } = renderHook(() => useCursor(options));
      const mockRef = { current: document.createElement('div') };

      act(() => {
        result.current.setSlotFocus(mockRef as any, 'test-key');
      });

      expect(mockGetSlotDom).toHaveBeenCalledWith('test-key');
    });

    it('should find first focusable slot when no key provided', () => {
      const options = {
        prefixCls: 'test',
        getSlotDom: mockGetSlotDom,
        slotConfigMap: mockSlotConfigMap,
        getNodeInfo: mockGetNodeInfo,
        getEditorValue: mockGetEditorValue,
      };

      const mockEditableDiv = document.createElement('div');
      const mockSlotSpan = document.createElement('span');
      mockSlotSpan.setAttribute('data-slot-key', 'found-key');
      mockEditableDiv.appendChild(mockSlotSpan);

      const mockSlotDom = document.createElement('span');
      const mockInput = document.createElement('input');
      mockSlotDom.appendChild(mockInput);

      mockGetSlotDom.mockReturnValue(mockSlotDom as any);
      mockSlotConfigMap.set('found-key', { type: 'input' });

      const { result } = renderHook(() => useCursor(options));
      const mockRef = { current: mockEditableDiv };

      act(() => {
        result.current.setSlotFocus(mockRef as any);
      });

      expect(mockGetSlotDom).toHaveBeenCalledWith('found-key');
    });
  });

  describe('getInsertPosition', () => {
    it('should handle start position', () => {
      const { result } = renderHook(() => useCursor());

      const position = result.current.getInsertPosition('start');
      expect(position.type).toBe('start');
    });

    it('should return start when startContainer is outside editable but endContainer is inside', () => {
      const startTextNode = document.createTextNode('start');
      const endTextNode = document.createTextNode('end');
      const mockRange = {
        endContainer: endTextNode,
        startContainer: startTextNode,
        endOffset: 2,
        startOffset: 1,
      };
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockReturnValue(mockRange),
      };

      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const { result } = renderHook(() => useCursor());
      const mockEditableDom = document.createElement('div');
      mockEditableDom.contains = jest.fn().mockImplementation((node: any) => node === endTextNode);
      const mockRef = { current: mockEditableDom };

      const position = result.current.getInsertPosition('cursor', mockRef as any);
      expect(position.type).toBe('start');
    });

    it('should handle has range', () => {
      const mockRange: any = {
        current: {
          endContainer: document.createTextNode('test'),
          endOffset: 2,
        },
      };

      const { result } = renderHook(() => useCursor());
      const mockEditableDom = document.createElement('div');
      const mockRef = { current: mockEditableDom };
      const position = result.current.getInsertPosition('cursor', mockRef, mockRange);
      expect(position.type).toBe('end');
    });
    it('should handle end position', () => {
      const { result } = renderHook(() => useCursor());

      const position = result.current.getInsertPosition('end');
      expect(position.type).toBe('end');
    });

    it('should handle cursor position', () => {
      const mockRange = {
        endContainer: document.createTextNode('test'),
        endOffset: 2,
      };
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockReturnValue(mockRange),
      };

      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const options = {
        prefixCls: 'test',
        getSlotDom: mockGetSlotDom,
        slotConfigMap: mockSlotConfigMap,
        getNodeInfo: mockGetNodeInfo,
        getEditorValue: mockGetEditorValue,
      };

      const mockEditableDom = document.createElement('div');
      const mockRef = { current: mockEditableDom };

      mockGetNodeInfo.mockReturnValue({
        slotKey: 'test',
        slotConfig: { key: 'test', type: 'input' },
      });

      const { result } = renderHook(() => useCursor(options));

      const position = result.current.getInsertPosition('cursor', mockRef);
      expect(position.type).toBe('end');
    });

    it('should handle box position', () => {
      const mockTextNode = document.createTextNode('test');
      const mockRange = {
        endContainer: mockTextNode,
        startContainer: mockTextNode,
        endOffset: 2,
      };
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockReturnValue(mockRange),
      };

      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const options = {
        prefixCls: 'test',
        getSlotDom: mockGetSlotDom,
        slotConfigMap: mockSlotConfigMap,
        getNodeInfo: mockGetNodeInfo,
        getEditorValue: mockGetEditorValue,
      };

      const mockEditableDom = document.createElement('div');
      mockEditableDom.appendChild(mockTextNode);
      // Mock contains method to return true for the text node
      mockEditableDom.contains = jest.fn().mockReturnValue(true);
      const mockRef = { current: mockEditableDom };

      mockGetNodeInfo.mockReturnValue(null);

      const { result } = renderHook(() => useCursor(options));

      const position = result.current.getInsertPosition('cursor', mockRef);
      expect(position.type).toBe('box');
    });

    it('should handle no selection', () => {
      (window.getSelection as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() => useCursor());

      const position = result.current.getInsertPosition('cursor');
      expect(position.type).toBe('end');
    });

    it('should handle no range', () => {
      const mockSelection = {
        rangeCount: 0,
      };

      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const { result } = renderHook(() => useCursor());

      const position = result.current.getInsertPosition('cursor');
      expect(position.type).toBe('end');
    });

    it('should handle no editable ref', () => {
      const mockRange = {
        endContainer: document.createTextNode('test'),
        endOffset: 2,
      };
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockReturnValue(mockRange),
      };

      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const { result } = renderHook(() => useCursor());

      const position = result.current.getInsertPosition('cursor');
      expect(position.type).toBe('end');
    });

    it('should handle container outside editable box', () => {
      const mockTextNode = document.createTextNode('test');
      const mockRange = {
        endContainer: mockTextNode,
        endOffset: 2,
      };
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockReturnValue(mockRange),
      };

      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const options = {
        prefixCls: 'test',
        getSlotDom: mockGetSlotDom,
        slotConfigMap: mockSlotConfigMap,
        getNodeInfo: mockGetNodeInfo,
        getEditorValue: mockGetEditorValue,
      };

      const mockEditableDom = document.createElement('div');
      // Don't add the text node to the editable div to simulate outside
      const mockRef = { current: mockEditableDom };

      const { result } = renderHook(() => useCursor(options));

      const position = result.current.getInsertPosition('cursor', mockRef);
      expect(position.type).toBe('end');
    });

    it('should handle getNodeInfo returning null in getInsertPosition', () => {
      const mockTextNode = document.createTextNode('test');
      const mockRange = {
        endContainer: mockTextNode,
        startContainer: mockTextNode,
        endOffset: 2,
      };
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockReturnValue(mockRange),
      };

      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const options = {
        prefixCls: 'test',
        getSlotDom: mockGetSlotDom,
        slotConfigMap: mockSlotConfigMap,
        getNodeInfo: jest.fn().mockReturnValue(null),
        getEditorValue: mockGetEditorValue,
      };

      const mockEditableDom = document.createElement('div');
      mockEditableDom.appendChild(mockTextNode);
      // Mock contains method to return true for the text node
      mockEditableDom.contains = jest.fn().mockReturnValue(true);
      const mockRef = { current: mockEditableDom };

      const { result } = renderHook(() => useCursor(options));

      const position = result.current.getInsertPosition('cursor', mockRef);
      expect(position.type).toBe('box');
    });

    it('should return start when skillKey is detected in the same outer span container', () => {
      const mockTextNode = document.createTextNode('test');
      const mockRange = {
        endContainer: mockTextNode,
        startContainer: mockTextNode,
        endOffset: 2,
        startOffset: 1,
      };
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockReturnValue(mockRange),
        removeAllRanges: jest.fn(),
        addRange: jest.fn(),
      };
      (window.getSelection as jest.Mock).mockReturnValue(mockSelection);

      const options = {
        prefixCls: 'test',
        getSlotDom: mockGetSlotDom,
        slotConfigMap: mockSlotConfigMap,
        getNodeInfo: jest.fn().mockReturnValue({ skillKey: 'skill' }),
        getEditorValue: mockGetEditorValue,
      };

      const mockEditableDom = document.createElement('div');
      const span = document.createElement('span');
      span.appendChild(mockTextNode);
      mockEditableDom.appendChild(span);
      const mockRef = { current: mockEditableDom };

      const { result } = renderHook(() => useCursor(options));
      const position = result.current.getInsertPosition('cursor', mockRef as any);
      expect(position.type).toBe('start');
    });
  });

  describe('getEndRange', () => {
    it('should get end range correctly', () => {
      const mockEditableDom = document.createElement('div');
      mockEditableDom.appendChild(document.createTextNode('test'));

      const mockRange = {
        setStart: jest.fn(),
        setEnd: jest.fn(),
        collapse: jest.fn(),
      };
      (document.createRange as jest.Mock).mockReturnValue(mockRange);

      const { result } = renderHook(() => useCursor());

      const range = result.current.getEndRange(mockEditableDom);
      expect(range).toBe(mockRange);
    });

    it('should handle text node ending with newline', () => {
      const mockEditableDom = document.createElement('div');
      mockEditableDom.appendChild(document.createTextNode('test\n'));

      const mockRange = {
        setStart: jest.fn(),
        setEnd: jest.fn(),
        collapse: jest.fn(),
      };
      (document.createRange as jest.Mock).mockReturnValue(mockRange);

      const { result } = renderHook(() => useCursor());

      const range = result.current.getEndRange(mockEditableDom);
      expect(range).toBe(mockRange);
    });
  });

  describe('getStartRange', () => {
    it('should get start range without skill', () => {
      const mockEditableDom = document.createElement('div');

      const mockRange = {
        setStart: jest.fn(),
        setEnd: jest.fn(),
        collapse: jest.fn(),
      };
      (document.createRange as jest.Mock).mockReturnValue(mockRange);

      const { result } = renderHook(() => useCursor());

      const range = result.current.getStartRange(mockEditableDom);
      expect(range).toBe(mockRange);
    });

    it('should get start range with skill', () => {
      const mockEditableDom = document.createElement('div');

      const mockRange = {
        setStart: jest.fn(),
        setEnd: jest.fn(),
        collapse: jest.fn(),
      };
      (document.createRange as jest.Mock).mockReturnValue(mockRange);

      const options = {
        prefixCls: 'test',
        getSlotDom: mockGetSlotDom,
        slotConfigMap: mockSlotConfigMap,
        getNodeInfo: mockGetNodeInfo,
        getEditorValue: jest.fn().mockReturnValue({ skill: { value: 'test' } }),
      };

      const { result } = renderHook(() => useCursor(options));

      const range = result.current.getStartRange(mockEditableDom);
      expect(range).toBe(mockRange);
    });
  });

  describe('setAfterNodeFocus', () => {
    it('should handle null range', () => {
      const { result } = renderHook(() => useCursor());
      const mockTargetNode = document.createElement('div');
      const mockEditableNode = document.createElement('div');

      act(() => {
        result.current.setAfterNodeFocus(mockTargetNode, mockEditableNode, null, {
          removeAllRanges: jest.fn(),
          addRange: jest.fn(),
        } as any);
      });

      // Should not throw
    });

    it('should set focus after node', () => {
      const { result } = renderHook(() => useCursor());
      const mockTargetNode = document.createElement('div');
      const mockEditableNode = document.createElement('div');
      mockEditableNode.focus = jest.fn();
      const mockRange = {
        setStartAfter: jest.fn(),
        collapse: jest.fn(),
      };
      const mockSelection = {
        removeAllRanges: jest.fn(),
        addRange: jest.fn(),
      };

      act(() => {
        result.current.setAfterNodeFocus(
          mockTargetNode,
          mockEditableNode,
          mockRange as any,
          mockSelection as any,
        );
      });

      expect(mockEditableNode.focus).toHaveBeenCalled();
      expect(mockRange.setStartAfter).toHaveBeenCalledWith(mockTargetNode);
      expect(mockRange.collapse).toHaveBeenCalledWith(false);
      expect(mockSelection.removeAllRanges).toHaveBeenCalled();
      expect(mockSelection.addRange).toHaveBeenCalledWith(mockRange);
    });
  });

  describe('focus method errors', () => {
    it('should handle focus errors gracefully', () => {
      const mockTargetNode = {
        focus: jest.fn().mockImplementation(() => {
          throw new Error('Focus error');
        }),
      };

      const { result } = renderHook(() => useCursor());

      act(() => {
        expect(() => result.current.setEndCursor(mockTargetNode as any)).not.toThrow();
      });
    });

    it('should handle non-focusable elements', () => {
      const mockTargetNode = {};

      const { result } = renderHook(() => useCursor());

      act(() => {
        expect(() => result.current.setEndCursor(mockTargetNode as any)).not.toThrow();
      });
    });
  });
});
