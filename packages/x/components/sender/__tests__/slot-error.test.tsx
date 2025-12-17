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
        setStartAfter: jest.fn(),
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
        if (index !== 0) throw new DOMException('Index out of range', 'IndexSizeError');
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
afterEach(() => {
  jest.restoreAllMocks();
});

describe('SlotTextArea Final Coverage Enhancement', () => {
  describe('Advanced edge cases and error handling', () => {
    it('should handle complex DOM manipulation scenarios', () => {
      const ref = React.createRef<any>();

      // Test with real DOM elements
      render(
        <Sender
          slotConfig={[
            { type: 'text', value: 'Hello' },
            { type: 'input', key: 'name', props: { defaultValue: 'World' } },
          ]}
          ref={ref}
        />,
      );

      // Test various edge cases
      expect(() => {
        // Test with empty selection
        const originalGetSelection = window.getSelection;
        Object.defineProperty(window, 'getSelection', {
          value: () => ({
            rangeCount: 0,
            getRangeAt: () => null,
            removeAllRanges: jest.fn(),
            addRange: jest.fn(),
          }),
          writable: true,
        });

        ref.current?.insert([{ type: 'text', value: 'test' }]);
        +(
          // Restore
          Object.defineProperty(window, 'getSelection', {
            value: originalGetSelection,
            writable: true,
          })
        );

        ref.current?.focus();
        ref.current?.clear();
      }).not.toThrow();
    });

    it('should handle slot validation and error states', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Test invalid slot configurations
      const invalidSlots = [
        { type: 'unknown' as any, key: 'test' },
        { type: 'input' }, // missing key
        { type: 'select', key: 'test', props: { options: [] } },
      ];

      expect(() => {
        render(<Sender slotConfig={invalidSlots as any} />);
      }).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should handle paste events with complex data', () => {
      const onPaste = jest.fn();
      const { container } = render(
        <Sender slotConfig={[{ type: 'text', value: 'Test' }]} onPaste={onPaste} />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      // Test paste with files
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

      expect(() => {
        fireEvent.paste(inputArea, {
          clipboardData: {
            getData: () => 'pasted text',
            files: [mockFile],
            items: [
              { kind: 'string', type: 'text/plain', getAsString: (cb: any) => cb('text') },
              { kind: 'file', type: 'text/plain', getAsFile: () => mockFile },
            ],
          },
        });
      }).not.toThrow();
    });

    it('should handle keyboard events with special keys', () => {
      const { container } = render(<Sender slotConfig={[{ type: 'text', value: 'Test' }]} />);

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      // Test various key combinations
      expect(() => {
        fireEvent.keyDown(inputArea, { key: 'Tab', shiftKey: true });
        fireEvent.keyDown(inputArea, { key: 'Escape' });
        fireEvent.keyDown(inputArea, { key: 'ArrowLeft' });
        fireEvent.keyDown(inputArea, { key: 'ArrowRight' });
        fireEvent.keyDown(inputArea, { key: 'ArrowUp' });
        fireEvent.keyDown(inputArea, { key: 'ArrowDown' });
        fireEvent.keyDown(inputArea, { key: 'Home' });
        fireEvent.keyDown(inputArea, { key: 'End' });
        fireEvent.keyDown(inputArea, { key: 'Delete' });
      }).not.toThrow();
    });

    it('should handle auto-resize functionality', () => {
      const { container } = render(
        <Sender
          slotConfig={[{ type: 'text', value: 'Test content' }]}
          autoSize={{ minRows: 2, maxRows: 5 }}
        />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      expect(inputArea).toBeInTheDocument();

      // Test with very long content
      expect(() => {
        fireEvent.input(inputArea, { target: { innerText: 'Very long content '.repeat(100) } });
      }).not.toThrow();
    });

    it('should handle skill interactions with complex scenarios', () => {
      const { rerender, container } = render(
        <Sender
          slotConfig={[{ type: 'text', value: 'Test' }]}
          skill={{ value: 'test-skill', title: 'Test Skill' }}
        />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      // Test skill removal
      expect(() => {
        fireEvent.keyDown(inputArea, { key: 'Backspace' });
      }).not.toThrow();

      // Test skill change
      expect(() => {
        rerender(
          <Sender
            slotConfig={[{ type: 'text', value: 'Test' }]}
            skill={{ value: 'new-skill', title: 'New Skill' }}
          />,
        );
      }).not.toThrow();

      // Test skill removal
      expect(() => {
        rerender(<Sender slotConfig={[{ type: 'text', value: 'Test' }]} />);
      }).not.toThrow();
    });

    it('should handle slot insertion at specific positions', () => {
      const ref = React.createRef<any>();

      render(
        <Sender
          slotConfig={[
            { type: 'text', value: 'Hello' },
            { type: 'input', key: 'name', props: { placeholder: 'Name' } },
            { type: 'text', value: 'World' },
          ]}
          ref={ref}
        />,
      );

      // Test insertion at different positions
      expect(() => {
        ref.current?.insert([{ type: 'text', value: 'inserted' }], 'start');
        ref.current?.insert([{ type: 'text', value: 'inserted' }], 'end');
        ref.current?.insert([{ type: 'text', value: 'inserted' }], 'all');
        ref.current?.insert([{ type: 'text', value: 'inserted' }], 'slot', { key: 'name' });
      }).not.toThrow();
    });

    it('should handle getValue with complex slot configurations', () => {
      const ref = React.createRef<any>();

      const complexConfig: SlotConfigType[] = [
        { type: 'text', value: 'Hello' },
        { type: 'input', key: 'name', props: { defaultValue: 'John' } },
        { type: 'select', key: 'gender', props: { options: ['M', 'F'], defaultValue: 'M' } },
        { type: 'tag', key: 'role', props: { label: 'Admin', value: 'admin' } },
        { type: 'content', key: 'description', props: { defaultValue: 'Description' } },
      ];

      render(
        <Sender
          slotConfig={complexConfig}
          skill={{ value: 'test-skill', title: 'Test' }}
          ref={ref}
        />,
      );

      const result = ref.current?.getValue();

      expect(result).toHaveProperty('value');
      expect(result).toHaveProperty('slotConfig');
      expect(result).toHaveProperty('skill');
      expect(Array.isArray(result.slotConfig)).toBe(true);
    });

    it('should handle focus with scroll prevention', () => {
      const ref = React.createRef<any>();

      render(<Sender slotConfig={[{ type: 'text', value: 'Test' }]} ref={ref} />);

      expect(() => {
        ref.current?.focus({ preventScroll: true });
        ref.current?.focus({ cursor: 'start', preventScroll: true });
        ref.current?.focus({ cursor: 'end', preventScroll: true });
        ref.current?.focus({ cursor: 'all', preventScroll: true });
      }).not.toThrow();
    });

    it('should handle slot rendering with custom props', () => {
      const { container } = render(
        <Sender
          slotConfig={[
            {
              type: 'input',
              key: 'custom-input',
              props: {
                placeholder: 'Custom placeholder',
              },
            },
          ]}
        />,
      );

      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('should handle clear with partial slot configurations', () => {
      const ref = React.createRef<any>();

      const partialConfig: SlotConfigType[] = [
        { type: 'text', value: '' }, // empty text
        { type: 'input', key: 'empty-input', props: {} }, // no default value
        { type: 'select', key: 'empty-select', props: { options: [] } }, // empty options
      ];

      render(<Sender slotConfig={partialConfig} ref={ref} />);

      expect(() => {
        ref.current?.clear();
        const result = ref.current?.getValue();
        expect(result.value).toBe('');
      }).not.toThrow();
    });
  });
});
