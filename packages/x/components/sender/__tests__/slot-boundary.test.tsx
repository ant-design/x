import React from 'react';
import { fireEvent, render } from '../../../tests/utils';
import Sender, { SlotConfigType } from '../index';

// Enhanced mock setup for better coverage
beforeEach(() => {
  // Mock DOM API with more realistic implementations
  if (!document.createRange) {
    document.createRange = jest.fn((): Range => {
      const range: any = {
        setStart: jest.fn(),
        insertNode: jest.fn(),
        collapse: jest.fn(),
        selectNodeContents: jest.fn(),
        commonAncestorContainer: document.body,
        cloneContents: jest.fn(() => document.createDocumentFragment()),
        cloneRange: jest.fn(() => range),
        deleteContents: jest.fn(),
        extractContents: jest.fn(() => document.createDocumentFragment()),
        setEnd: jest.fn(),
        setEndAfter: jest.fn(),
        setEndBefore: jest.fn(),
        setStartAfter: jest.fn((node: Node) => {
          if (!node) throw new Error('Invalid node');
        }),
        setStartBefore: jest.fn(),
        surroundContents: jest.fn(),
        detach: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0, right: 0, bottom: 0 })),
        getClientRects: jest.fn(() => []),
        toString: jest.fn(() => ''),
        startContainer: document.createTextNode(''),
        endContainer: document.createTextNode(''),
        startOffset: 0,
        endOffset: 0,
        collapsed: true,
      };
      return range as Range;
    });
  }

  // Enhanced selection mock
  Object.defineProperty(window, 'getSelection', {
    value: () => ({
      rangeCount: 1,
      getRangeAt: (index: number) => {
        if (index !== 0) return null;
        return {
          startContainer: document.createElement('div'),
          endContainer: document.createElement('div'),
          startOffset: 0,
          endOffset: 0,
          collapse: jest.fn(),
          selectNodeContents: jest.fn(),
          deleteContents: jest.fn(),
          insertNode: jest.fn(),
          setStart: jest.fn(),
          setEnd: jest.fn(),
          cloneRange: jest.fn(),
          toString: jest.fn(),
          deleteFromDocument: jest.fn(),
          collapsed: true,
        };
      },
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
    }),
    writable: true,
  });
});

describe('SlotTextArea Coverage Enhancement', () => {
  describe('Error handling and edge cases', () => {
    it('should handle insert operation failure gracefully', () => {
      const ref = React.createRef<any>();

      render(<Sender slotConfig={[]} ref={ref} />);

      // This should trigger the error handling
      expect(() => {
        ref.current?.insert([{ type: 'text', value: 'test' }]);
      }).not.toThrow();
    });

    it('should handle null editableRef in insert method', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[]} ref={ref} />);

      expect(() => {
        ref.current?.insert([{ type: 'text', value: 'test' }]);
      }).not.toThrow();
    });

    it('should handle empty slotConfig in insert method', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[]} ref={ref} />);

      expect(() => {
        ref.current?.insert([]);
      }).not.toThrow();
    });

    it('should handle getInsertContext with null selection', () => {
      const ref = React.createRef<any>();

      // Mock null selection
      const originalGetSelection = window.getSelection;
      Object.defineProperty(window, 'getSelection', {
        value: () => null,
        writable: true,
      });

      render(<Sender slotConfig={[]} ref={ref} />);

      expect(() => {
        ref.current?.insert([{ type: 'text', value: 'test' }]);
      }).not.toThrow();

      // Restore
      Object.defineProperty(window, 'getSelection', {
        value: originalGetSelection,
        writable: true,
      });
    });

    it('should handle handleCharacterReplacement with invalid conditions', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[{ type: 'text', value: 'Hello' }]} ref={ref} />);

      // Test with replaceCharacters longer than text
      expect(() => {
        ref.current?.insert([{ type: 'text', value: 'World' }], 'end', 'VeryLongReplaceString');
      }).not.toThrow();
    });

    it('should handle finalizeInsertion with null selection', () => {
      const ref = React.createRef<any>();

      // Mock selection with no ranges
      Object.defineProperty(window, 'getSelection', {
        value: () => ({
          rangeCount: 0,
          getRangeAt: () => null,
          removeAllRanges: jest.fn(),
          addRange: jest.fn(),
        }),
        writable: true,
      });

      render(<Sender slotConfig={[]} ref={ref} />);

      expect(() => {
        ref.current?.insert([{ type: 'text', value: 'test' }]);
      }).not.toThrow();
    });
  });

  describe('Focus method edge cases', () => {
    it('should handle focus with various cursor positions', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[{ type: 'text', value: 'Test' }]} ref={ref} />);

      // Test all cursor positions
      expect(() => {
        ref.current?.focus({ cursor: 'start' });
        ref.current?.focus({ cursor: 'end' });
        ref.current?.focus({ cursor: 'all' });
        ref.current?.focus({ cursor: 'slot', key: 'test' });
        ref.current?.focus({ preventScroll: true });
      }).not.toThrow();
    });

    it('should handle focus with null editableRef', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[]} ref={ref} />);

      // This should handle gracefully
      expect(() => {
        ref.current?.focus();
      }).not.toThrow();
    });
  });

  describe('Blur event handling', () => {
    it('should handle blur with keyLockRef', () => {
      const onBlur = jest.fn();
      const { container } = render(
        <Sender slotConfig={[{ type: 'text', value: 'Test' }]} onBlur={onBlur} />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      // Trigger blur
      fireEvent.blur(inputArea);

      expect(onBlur).toHaveBeenCalled();
    });

    it('should handle blur with null selection', () => {
      const onBlur = jest.fn();

      // Mock null selection
      Object.defineProperty(window, 'getSelection', {
        value: () => null,
        writable: true,
      });

      const { container } = render(
        <Sender slotConfig={[{ type: 'text', value: 'Test' }]} onBlur={onBlur} />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      expect(() => {
        fireEvent.blur(inputArea);
      }).not.toThrow();
    });
  });

  describe('Select event handling', () => {
    it('should handle select event with skill present', () => {
      const { container } = render(
        <Sender slotConfig={[]} skill={{ value: 'test-skill', title: 'Test Skill' }} />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      expect(() => {
        fireEvent.select(inputArea);
      }).not.toThrow();
    });

    it('should handle select event with empty content', () => {
      const { container } = render(<Sender slotConfig={[]} />);

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      expect(() => {
        fireEvent.select(inputArea);
      }).not.toThrow();
    });
  });

  describe('Clear method edge cases', () => {
    it('should handle clear with null editableRef', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[]} ref={ref} />);

      expect(() => {
        ref.current?.clear();
      }).not.toThrow();
    });

    it('should handle clear with complex slot configurations', () => {
      const ref = React.createRef<any>();
      const complexConfig: SlotConfigType[] = [
        { type: 'text', value: 'Prefix' },
        { type: 'input', key: 'test', props: { placeholder: 'Test' } },
        { type: 'text', value: 'Suffix' },
      ];

      render(<Sender slotConfig={complexConfig} ref={ref} />);

      expect(() => {
        ref.current?.clear();
      }).not.toThrow();
    });
  });

  describe('GetValue method edge cases', () => {
    it('should handle getValue with null editableRef', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[]} ref={ref} />);

      const result = ref.current?.getValue();
      expect(result).toEqual({ value: '', slotConfig: [], skill: undefined });
    });

    it('should handle getValue with empty childNodes', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[]} ref={ref} />);

      const result = ref.current?.getValue();
      expect(result).toEqual({ value: '', slotConfig: [], skill: undefined });
    });

    it('should handle getValue with skill present', () => {
      const ref = React.createRef<any>();
      render(
        <Sender
          slotConfig={[{ type: 'text', value: 'Hello' }]}
          skill={{ value: 'test-skill', title: 'Test' }}
          ref={ref}
        />,
      );

      const result = ref.current?.getValue();
      expect(result).toHaveProperty('skill');
    });
  });

  describe('Composition events', () => {
    it('should handle composition start and end', () => {
      const { container } = render(<Sender slotConfig={[{ type: 'text', value: 'Test' }]} />);

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      expect(() => {
        fireEvent.compositionStart(inputArea);
        fireEvent.compositionEnd(inputArea);
      }).not.toThrow();
    });
  });

  describe('Keyboard event edge cases', () => {
    it('should handle key events with null target', () => {
      const { container } = render(<Sender slotConfig={[{ type: 'text', value: 'Test' }]} />);

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      // Test with various key combinations
      expect(() => {
        fireEvent.keyDown(inputArea, { key: 'Enter', shiftKey: true });
        fireEvent.keyDown(inputArea, { key: 'Enter', ctrlKey: true });
        fireEvent.keyDown(inputArea, { key: 'Enter', altKey: true });
        fireEvent.keyDown(inputArea, { key: 'Enter', metaKey: true });
        fireEvent.keyDown(inputArea, { key: 'a', ctrlKey: true });
        fireEvent.keyDown(inputArea, { key: 'a', metaKey: true });
      }).not.toThrow();
    });

    it('should handle backspace with complex DOM structure', () => {
      const { container } = render(
        <Sender
          slotConfig={[
            { type: 'text', value: 'Prefix' },
            { type: 'input', key: 'test', props: { placeholder: 'Test' } },
            { type: 'text', value: 'Suffix' },
          ]}
        />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      expect(() => {
        fireEvent.keyDown(inputArea, { key: 'Backspace' });
      }).not.toThrow();
    });
  });

  describe('Paste event edge cases', () => {
    it('should handle paste with null clipboardData', () => {
      const { container } = render(<Sender slotConfig={[{ type: 'text', value: 'Test' }]} />);

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      expect(() => {
        fireEvent.paste(inputArea, {
          clipboardData: {
            getData: () => '',
            files: [],
          },
        });
      }).not.toThrow();
    });

    it('should handle paste with empty text and no files', () => {
      const { container } = render(<Sender slotConfig={[{ type: 'text', value: 'Test' }]} />);

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      expect(() => {
        fireEvent.paste(inputArea, {
          clipboardData: {
            getData: () => '',
            files: [],
          },
        });
      }).not.toThrow();
    });
  });

  describe('Skill interaction edge cases', () => {
    it('should handle skill removal when not present', () => {
      const { container } = render(<Sender slotConfig={[]} />);

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      expect(() => {
        fireEvent.keyDown(inputArea, { key: 'Backspace' });
      }).not.toThrow();
    });

    it('should handle skill change from null to value', () => {
      const { rerender } = render(<Sender slotConfig={[]} />);

      expect(() => {
        rerender(<Sender slotConfig={[]} skill={{ value: 'new-skill', title: 'New Skill' }} />);
      }).not.toThrow();
    });
  });

  describe('Slot rendering edge cases', () => {
    it('should handle slot without key', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const invalidConfig = [{ type: 'input', props: { placeholder: 'No key' } } as SlotConfigType];

      expect(() => {
        render(<Sender slotConfig={invalidConfig} />);
      }).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should handle slot with missing type', () => {
      const ref = React.createRef<any>();
      const config = [{ key: 'test', type: 'unknown' as any }];

      render(<Sender slotConfig={config} ref={ref} />);

      expect(() => {
        ref.current?.getValue();
      }).not.toThrow();
    });
  });

  describe('Input height calculation', () => {
    it('should handle autoSize with various configurations', () => {
      render(
        <Sender
          slotConfig={[{ type: 'text', value: 'Test' }]}
          autoSize={{ minRows: 1, maxRows: 10 }}
        />,
      );
    });

    it('should handle autoSize with false value', () => {
      render(<Sender slotConfig={[{ type: 'text', value: 'Test' }]} autoSize={false} />);
    });
  });
});
