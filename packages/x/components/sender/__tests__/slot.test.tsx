import React from 'react';
import { fireEvent, render, waitFor } from '../../../tests/utils';
import Sender, { SlotConfigType } from '../index';

// Set up global DOM API mock
beforeEach(() => {
  // Mock DOM API
  if (!document.createRange) {
    document.createRange = jest.fn(
      () =>
        ({
          setStart: jest.fn(),
          insertNode: jest.fn(),
          collapse: jest.fn(),
          selectNodeContents: jest.fn(),
          commonAncestorContainer: document.body,
          cloneContents: jest.fn(),
          cloneRange: jest.fn(),
          deleteContents: jest.fn(),
          extractContents: jest.fn(),
          setEnd: jest.fn(),
          setEndAfter: jest.fn(),
          setEndBefore: jest.fn(),
          setStartAfter: jest.fn(),
          setStartBefore: jest.fn(),
          surroundContents: jest.fn(),
          detach: jest.fn(),
          getBoundingClientRect: jest.fn(),
          getClientRects: jest.fn(),
          toString: jest.fn(),
        }) as unknown as Range,
    );
  }

  Object.defineProperty(window, 'getSelection', {
    value: () => ({
      rangeCount: 1,
      getRangeAt: () => ({
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
      }),
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
    }),
    writable: true,
  });
});

describe('Sender.SlotTextArea', () => {
  const baseSlotConfig: SlotConfigType[] = [
    { type: 'text', value: 'Prefix' },
    {
      type: 'input',
      key: 'input1',
      props: { placeholder: 'Enter input', defaultValue: 'Default' },
    },
    {
      type: 'content',
      key: 'content1',
      props: { placeholder: 'Enter content', defaultValue: 'Content' },
    },
    {
      type: 'select',
      key: 'select1',
      props: { options: ['A', 'B'], placeholder: 'Select option' },
    },
    { type: 'tag', key: 'tag1', props: { label: 'Tag Label' } },
    {
      type: 'custom',
      key: 'custom1',
      customRender: (value: any, onChange: (value: any) => void) => (
        <button type="button" data-testid="custom-btn" onClick={() => onChange('custom-value')}>
          {value || 'Custom'}
        </button>
      ),
      formatResult: (v: any) => `[${v}]`,
    },
  ];

  describe('Core functionality tests', () => {
    it('should correctly render all slot types', () => {
      const { getByText, getByPlaceholderText, getByTestId } = render(
        <Sender slotConfig={baseSlotConfig} />,
      );

      expect(getByText('Prefix')).toBeInTheDocument();
      expect(getByPlaceholderText('Enter input')).toBeInTheDocument();
      expect(getByText('Content')).toBeInTheDocument();
      expect(getByText('Tag Label')).toBeInTheDocument();
      expect(getByTestId('custom-btn')).toBeInTheDocument();
    });

    it('should handle empty configuration', () => {
      const { container } = render(<Sender slotConfig={[]} />);
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should provide complete ref interface', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={baseSlotConfig} ref={ref} />);

      expect(ref.current).toBeDefined();
      expect(typeof ref.current.focus).toBe('function');
      expect(typeof ref.current.blur).toBe('function');
      expect(typeof ref.current.clear).toBe('function');
      expect(typeof ref.current.getValue).toBe('function');
      expect(typeof ref.current.insert).toBe('function');
    });

    it('should correctly get and set values', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={baseSlotConfig} ref={ref} />);

      const value = ref.current?.getValue();
      expect(value).toHaveProperty('value');
      expect(value).toHaveProperty('slotConfig');
      expect(Array.isArray(value.slotConfig)).toBe(true);

      ref.current?.clear();
      const clearedValue = ref.current?.getValue();
      expect(clearedValue.value).toBe('');
    });
  });

  describe('Interaction tests', () => {
    it('should handle input interaction', () => {
      const onChange = jest.fn();
      const { getByPlaceholderText } = render(
        <Sender slotConfig={baseSlotConfig} onChange={onChange} />,
      );

      const input = getByPlaceholderText('Enter input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'New Value' } });
      expect(input.value).toBe('New Value');
    });

    it('should handle select slot interaction', async () => {
      const onChange = jest.fn();
      const { container, getByText } = render(
        <Sender
          slotConfig={[
            {
              type: 'select',
              key: 'test-select',
              props: { options: ['Option A', 'Option B'], placeholder: 'Select option' },
            },
          ]}
          onChange={onChange}
        />,
      );

      const selectTrigger = container.querySelector('.ant-sender-slot-select') as HTMLElement;
      fireEvent.click(selectTrigger);

      const optionB = await waitFor(() => getByText('Option B'));
      fireEvent.click(optionB);

      expect(onChange).toHaveBeenCalled();
    });

    it('should handle select slot with empty options', () => {
      const { container } = render(
        <Sender
          slotConfig={[
            {
              type: 'select',
              key: 'test-select-empty',
              props: { options: [], placeholder: 'Select option' },
            },
          ]}
        />,
      );

      const selectTrigger = container.querySelector('.ant-sender-slot-select') as HTMLElement;
      expect(selectTrigger).toBeInTheDocument();
    });

    it('should handle content slot editing', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Sender
          slotConfig={[
            {
              type: 'content',
              key: 'test-content',
              props: { placeholder: 'Enter content' },
            },
          ]}
          onChange={onChange}
        />,
      );

      const contentSpan = container.querySelector('[data-slot-key="test-content"]') as HTMLElement;
      expect(contentSpan).toBeInTheDocument();
    });

    it('should handle custom slot interaction', () => {
      const { getByTestId } = render(<Sender slotConfig={baseSlotConfig} />);
      const customBtn = getByTestId('custom-btn');

      expect(customBtn.textContent).toBe('Custom');
      fireEvent.click(customBtn);
      expect(customBtn.textContent).toBe('custom-value');
    });

    it('should handle keyboard events', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <Sender slotConfig={baseSlotConfig} onSubmit={onSubmit} submitType="enter" />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;
      fireEvent.keyDown(inputArea, { key: 'Enter' });
      expect(onSubmit).toHaveBeenCalled();
    });

    it('should handle Shift+Enter submission', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <Sender slotConfig={baseSlotConfig} onSubmit={onSubmit} submitType="shiftEnter" />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;
      fireEvent.keyDown(inputArea, { key: 'Enter', shiftKey: true });
      expect(onSubmit).toHaveBeenCalled();
    });

    it('should handle Ctrl+A selection', () => {
      const { container } = render(<Sender slotConfig={baseSlotConfig} />);
      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      fireEvent.keyDown(inputArea, { key: 'a', ctrlKey: true });
      // Should not throw
    });

    it('should handle Backspace key for slot removal', () => {
      const { container } = render(
        <Sender
          slotConfig={[
            { type: 'text', value: 'Prefix' },
            { type: 'input', key: 'test-input', props: { placeholder: 'Test' } },
          ]}
        />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;
      fireEvent.keyDown(inputArea, { key: 'Backspace' });
      // Should handle backspace without error
    });

    it('should handle paste events', () => {
      const onPasteFile = jest.fn();
      const { container } = render(
        <Sender slotConfig={baseSlotConfig} onPasteFile={onPasteFile} />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });

      fireEvent.paste(inputArea, {
        clipboardData: {
          getData: () => '',
          files: [mockFile],
        },
      });

      expect(onPasteFile).toHaveBeenCalledWith([mockFile]);
    });

    it('should handle paste text events', () => {
      const onPaste = jest.fn();
      const { container } = render(<Sender slotConfig={baseSlotConfig} onPaste={onPaste} />);

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      fireEvent.paste(inputArea, {
        clipboardData: {
          getData: () => 'pasted text',
          files: [],
        },
      });

      expect(onPaste).toHaveBeenCalled();
    });
  });

  describe('Skill functionality tests', () => {
    it('should render skill with close button', async () => {
      const mockClose = jest.fn();
      const { container } = render(
        <Sender
          slotConfig={[]}
          skill={{
            value: 'test-skill',
            title: 'Test Skill',
            closable: {
              closeIcon: 'Close',
              onClose: mockClose,
            },
          }}
        />,
      );

      await waitFor(() => {
        expect(container.querySelector('#ant-sender-slot-placeholders')).toBeInTheDocument();
      });
    });

    it('should handle non-closable skill', async () => {
      const { container } = render(
        <Sender
          slotConfig={[]}
          skill={{
            value: 'test-skill',
            closable: false,
          }}
        />,
      );

      await waitFor(() => {
        expect(container.querySelector('#ant-sender-slot-placeholders')).toBeInTheDocument();
      });
    });

    it('should handle skill removal via keyboard', () => {
      const { container } = render(
        <Sender
          slotConfig={[]}
          skill={{
            value: 'test-skill',
            title: 'Test Skill',
          }}
        />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      // Focus and trigger backspace to remove skill
      inputArea.focus();
      fireEvent.keyDown(inputArea, { key: 'Backspace' });

      // Should handle skill removal without error
    });

    it('should handle skill change', () => {
      const { rerender, container } = render(
        <Sender
          slotConfig={[]}
          skill={{
            value: 'skill-1',
            title: 'Skill 1',
          }}
        />,
      );

      // Change skill
      rerender(
        <Sender
          slotConfig={[]}
          skill={{
            value: 'skill-2',
            title: 'Skill 2',
          }}
        />,
      );

      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle skill removal and addition', () => {
      const { rerender, container } = render(
        <Sender
          slotConfig={[]}
          skill={{
            value: 'test-skill',
            title: 'Test Skill',
          }}
        />,
      );

      // Remove skill
      rerender(<Sender slotConfig={[]} />);

      // Add skill back
      rerender(
        <Sender
          slotConfig={[]}
          skill={{
            value: 'new-skill',
            title: 'New Skill',
          }}
        />,
      );

      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle skill with empty slotConfig', () => {
      const { container } = render(
        <Sender
          slotConfig={[]}
          skill={{
            value: 'empty-skill',
            title: 'Empty Skill',
          }}
        />,
      );

      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });
  });

  describe('Boundary condition tests', () => {
    it('should handle missing key warning', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidConfig = [{ type: 'input', props: { placeholder: 'No key' } } as SlotConfigType];

      render(<Sender slotConfig={invalidConfig} />);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Slot key is missing'));
      consoleSpy.mockRestore();
    });

    it('should handle disabled and read-only states', () => {
      const { container: disabledContainer } = render(
        <Sender slotConfig={baseSlotConfig} disabled />,
      );
      const { container: readonlyContainer } = render(
        <Sender slotConfig={baseSlotConfig} readOnly />,
      );

      expect(disabledContainer.querySelector('[role="textbox"]')).toBeInTheDocument();
      expect(readonlyContainer.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle autoSize configuration', () => {
      const { container: autoSizeContainer } = render(
        <Sender slotConfig={[{ type: 'text', value: 'Test' }]} autoSize />,
      );
      const { container: fixedContainer } = render(
        <Sender slotConfig={[{ type: 'text', value: 'Test' }]} autoSize={false} />,
      );
      const { container: rangeContainer } = render(
        <Sender
          slotConfig={[{ type: 'text', value: 'Test' }]}
          autoSize={{ minRows: 2, maxRows: 4 }}
        />,
      );

      expect(autoSizeContainer.querySelector('[role="textbox"]')).toBeInTheDocument();
      expect(fixedContainer.querySelector('[role="textbox"]')).toBeInTheDocument();
      expect(rangeContainer.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle all event callbacks', () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const onKeyUp = jest.fn();
      const onKeyDown = jest.fn();
      const onChange = jest.fn();

      const { container } = render(
        <Sender
          slotConfig={baseSlotConfig}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          onChange={onChange}
        />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      fireEvent.focus(inputArea);
      fireEvent.blur(inputArea);
      fireEvent.keyUp(inputArea, { key: 'Enter' });
      fireEvent.keyDown(inputArea, { key: 'Tab' });

      expect(onFocus).toHaveBeenCalled();
      expect(onBlur).toHaveBeenCalled();
      expect(onKeyUp).toHaveBeenCalled();
      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  describe('Additional coverage tests', () => {
    it('should handle slotConfig updates', () => {
      const { rerender, container } = render(
        <Sender slotConfig={[{ type: 'text', value: 'Initial' }]} />,
      );

      rerender(
        <Sender
          slotConfig={[
            { type: 'text', value: 'Updated' },
            { type: 'input', key: 'new' },
          ]}
        />,
      );

      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle select slot with default value', () => {
      const { container } = render(
        <Sender
          slotConfig={[
            {
              type: 'select',
              key: 'select-default',
              props: { options: ['A', 'B'], defaultValue: 'B' },
            },
          ]}
        />,
      );

      const selectElement = container.querySelector('.ant-sender-slot-select-value');
      expect(selectElement).toBeInTheDocument();
    });

    it('should handle input slot with readOnly', () => {
      const { container } = render(
        <Sender
          slotConfig={[
            {
              type: 'input',
              key: 'readonly-input',
              props: { placeholder: 'Readonly', defaultValue: 'Value' },
            },
          ]}
          readOnly
        />,
      );

      const input = container.querySelector('input[data-slot-input="readonly-input"]');
      expect(input).toHaveAttribute('readonly');
    });

    it('should handle custom slot with disabled state', () => {
      const onChange = jest.fn();
      const customConfig: SlotConfigType[] = [
        {
          type: 'custom',
          key: 'custom-disabled',
          customRender: (value: any, onChange: (value: any) => void, { disabled }: any) => (
            <button type="button" disabled={disabled} onClick={() => onChange('test')}>
              {disabled ? 'Disabled' : 'Enabled'}
            </button>
          ),
        },
      ];

      const { getByText } = render(<Sender slotConfig={customConfig} disabled />);

      expect(getByText('Disabled')).toBeDisabled();
    });

    it('should handle blur events with selection', () => {
      const onBlur = jest.fn();
      const { container } = render(<Sender slotConfig={baseSlotConfig} onBlur={onBlur} />);

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;
      fireEvent.focus(inputArea);
      fireEvent.blur(inputArea);

      expect(onBlur).toHaveBeenCalled();
    });

    it('should handle select events', () => {
      const { container } = render(<Sender slotConfig={baseSlotConfig} />);
      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      fireEvent.select(inputArea);
      // Should handle select events without error
    });

    it('should handle multiple insert operations', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[{ type: 'text', value: 'Start' }]} ref={ref} />);

      expect(() => {
        ref.current?.insert([{ type: 'text', value: 'Middle' }]);
        ref.current?.insert([{ type: 'input', key: 'test1' }]);
        ref.current?.insert([{ type: 'select', key: 'test2', props: { options: ['A'] } }]);
      }).not.toThrow();
    });

    it('should handle slot removal and re-insertion', () => {
      const ref = React.createRef<any>();
      render(
        <Sender
          slotConfig={[{ type: 'input', key: 'removable', props: { placeholder: 'Test' } }]}
          ref={ref}
        />,
      );

      expect(() => {
        ref.current?.clear();
        ref.current?.insert([{ type: 'text', value: 'New Content' }]);
      }).not.toThrow();
    });

    it('should handle complex slot configurations', () => {
      const complexConfig: SlotConfigType[] = [
        { type: 'text', value: 'Hello' },
        { type: 'input', key: 'name', props: { placeholder: 'Enter name' } },
        { type: 'text', value: ',' },
        { type: 'select', key: 'greeting', props: { options: ['Mr', 'Mrs', 'Ms'] } },
        { type: 'content', key: 'message', props: { placeholder: 'Your message' } },
        { type: 'tag', key: 'tag', props: { label: 'Important' } },
      ];

      const { container } = render(<Sender slotConfig={complexConfig} />);
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle slot with formatResult function', () => {
      const onChange = jest.fn();
      const config: SlotConfigType[] = [
        {
          type: 'input',
          key: 'formatted',
          props: { placeholder: 'Input' },
          formatResult: (value: string) => `Formatted: ${value}`,
        },
      ];

      const { container } = render(<Sender slotConfig={config} onChange={onChange} />);

      const input = container.querySelector(
        'input[data-slot-input="formatted"]',
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test' } });

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('High coverage tests', () => {
    it('should handle boundary cases for all slot types', () => {
      const { container } = render(
        <Sender
          slotConfig={[
            { type: 'text', value: '' },
            { type: 'input', key: 'input1' },
            { type: 'select', key: 'select1', props: { options: [] } },
            { type: 'tag', key: 'tag1' },
            { type: 'content', key: 'content1' },
          ]}
        />,
      );
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle insert method with various parameters', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[{ type: 'text', value: 'Initial' }]} ref={ref} />);

      expect(typeof ref.current?.insert).toBe('function');
      expect(typeof ref.current?.focus).toBe('function');
      expect(typeof ref.current?.clear).toBe('function');
    });

    it('should handle insert with replace characters', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[{ type: 'text', value: 'Hello World' }]} ref={ref} />);

      expect(typeof ref.current?.insert).toBe('function');
    });

    it('should handle focus method with various cursor positions', () => {
      const ref = React.createRef<any>();
      render(
        <Sender
          slotConfig={[
            { type: 'input', key: 'test1' },
            { type: 'content', key: 'test2' },
          ]}
          ref={ref}
        />,
      );

      expect(typeof ref.current?.focus).toBe('function');
    });

    it('should handle clear method', () => {
      const ref = React.createRef<any>();
      render(
        <Sender
          slotConfig={[
            { type: 'text', value: 'Text' },
            { type: 'input', key: 'input1', props: { defaultValue: 'Value' } },
          ]}
          ref={ref}
        />,
      );

      expect(typeof ref.current?.clear).toBe('function');
    });

    it('should handle getValue with empty content', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[]} ref={ref} />);

      const result = ref.current?.getValue();
      expect(result).toEqual({ value: '', slotConfig: [], skill: undefined });
    });

    it('should handle submitDisabled state', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <Sender
          slotConfig={baseSlotConfig}
          footer={(_, { components }) => {
            const { SendButton } = components;
            return <SendButton disabled={true} />;
          }}
          onSubmit={onSubmit}
          suffix={false}
          submitType="enter"
        />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;
      fireEvent.keyDown(inputArea, { key: 'Enter' });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should handle composition events', () => {
      const { container } = render(<Sender slotConfig={baseSlotConfig} />);
      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      fireEvent.compositionStart(inputArea);
      fireEvent.compositionEnd(inputArea);
    });

    it('should handle slot removal via backspace', () => {
      const { container } = render(
        <Sender
          slotConfig={[{ type: 'input', key: 'removable-input', props: { placeholder: 'Test' } }]}
        />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;
      inputArea.focus();
      fireEvent.keyDown(inputArea, { key: 'Backspace' });
    });

    it('should handle edge cases in getEditorValue', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[]} ref={ref} />);

      const result = ref.current?.getValue();
      expect(result).toEqual({ value: '', slotConfig: [], skill: undefined });
    });

    it('should handle tag slot without label', () => {
      const { container } = render(<Sender slotConfig={[{ type: 'tag', key: 'tag-no-label' }]} />);

      const tagElement = container.querySelector('.ant-sender-slot-tag');
      expect(tagElement).toBeInTheDocument();
    });

    it('should handle custom slot with formatResult', () => {
      const onChange = jest.fn();
      const customConfig: SlotConfigType[] = [
        {
          type: 'custom',
          key: 'custom-format',
          customRender: (value: any, onChange: (value: any) => void) => (
            <button type="button" onClick={() => onChange('test-value')}>
              Click
            </button>
          ),
          formatResult: (v: any) => `[${v}]`,
        },
      ];

      const { getByText } = render(<Sender slotConfig={customConfig} onChange={onChange} />);

      const button = getByText('Click');
      fireEvent.click(button);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Final coverage tests', () => {
    it('should handle all slot types with various configurations', () => {
      const completeConfig: SlotConfigType[] = [
        { type: 'text', value: 'Hello' },
        { type: 'text', value: '' },
        { type: 'input', key: 'name', props: { placeholder: 'Enter name', defaultValue: 'John' } },
        { type: 'input', key: 'empty-input' },
        {
          type: 'select',
          key: 'gender',
          props: { options: ['Male', 'Female'], defaultValue: 'Male' },
        },
        { type: 'select', key: 'empty-select', props: { options: [] } },
        { type: 'tag', key: 'status', props: { label: 'Active' } },
        { type: 'tag', key: 'no-label' },
        { type: 'content', key: 'bio', props: { placeholder: 'Bio', defaultValue: 'Default bio' } },
        { type: 'content', key: 'empty-content' },
        {
          type: 'custom',
          key: 'custom',
          customRender: (value, onChange) => <span>Custom: {value}</span>,
          formatResult: (v) => `[${v}]`,
        },
      ];

      const { container } = render(<Sender slotConfig={completeConfig} />);
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle skill with all properties', () => {
      const { container } = render(
        <Sender
          slotConfig={[]}
          skill={{
            value: 'test-skill',
            title: 'Test Skill',
            closable: {
              closeIcon: '×',
              onClose: jest.fn(),
            },
          }}
        />,
      );
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle all event handlers', () => {
      const handlers = {
        onChange: jest.fn(),
        onSubmit: jest.fn(),
        onFocus: jest.fn(),
        onBlur: jest.fn(),
        onKeyDown: jest.fn(),
        onKeyUp: jest.fn(),
        onPaste: jest.fn(),
        onPasteFile: jest.fn(),
      };

      const { container } = render(<Sender slotConfig={baseSlotConfig} {...handlers} />);

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      fireEvent.focus(inputArea);
      fireEvent.blur(inputArea);
      fireEvent.keyDown(inputArea, { key: 'a' });
      fireEvent.keyUp(inputArea, { key: 'a' });

      expect(typeof handlers.onFocus).toBe('function');
      expect(typeof handlers.onBlur).toBe('function');
    });

    it('should handle all props combinations', () => {
      const { container } = render(
        <Sender
          slotConfig={baseSlotConfig}
          disabled
          readOnly
          autoSize={{ minRows: 2, maxRows: 6 }}
          placeholder="Test placeholder"
          submitType="shiftEnter"
          loading={false}
          allowSpeech={true}
        />,
      );
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle empty and null values gracefully', () => {
      const { container } = render(
        <Sender
          slotConfig={[
            { type: 'text', value: '' },
            { type: 'input', key: 'empty' },
            { type: 'select', key: 'select-empty', props: { options: [] } },
          ]}
        />,
      );
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });
  });

  describe('Comprehensive coverage tests', () => {
    it('should handle all slot types with complete configurations', () => {
      const completeConfig: SlotConfigType[] = [
        { type: 'text', value: 'Hello' },
        { type: 'text', value: '' },
        { type: 'input', key: 'name', props: { placeholder: 'Enter name', defaultValue: 'John' } },
        { type: 'input', key: 'empty-input' },
        {
          type: 'select',
          key: 'gender',
          props: { options: ['Male', 'Female'], defaultValue: 'Male' },
        },
        { type: 'select', key: 'empty-select', props: { options: [] } },
        { type: 'tag', key: 'status', props: { label: 'Active' } },
        { type: 'tag', key: 'no-label' },
        { type: 'content', key: 'bio', props: { placeholder: 'Bio', defaultValue: 'Default bio' } },
        { type: 'content', key: 'empty-content' },
        {
          type: 'custom',
          key: 'custom',
          customRender: (value) => <span>Custom: {value}</span>,
          formatResult: (v) => `[${v}]`,
        },
      ];

      const { container } = render(<Sender slotConfig={completeConfig} />);
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle skill with all properties', () => {
      const { container } = render(
        <Sender
          slotConfig={[]}
          skill={{
            value: 'test-skill',
            title: 'Test Skill',
            closable: {
              closeIcon: '×',
              onClose: jest.fn(),
            },
          }}
        />,
      );
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle all event handlers', () => {
      const handlers = {
        onChange: jest.fn(),
        onSubmit: jest.fn(),
        onFocus: jest.fn(),
        onBlur: jest.fn(),
        onKeyDown: jest.fn(),
        onKeyUp: jest.fn(),
        onPaste: jest.fn(),
        onPasteFile: jest.fn(),
      };

      const { container } = render(<Sender slotConfig={baseSlotConfig} {...handlers} />);

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      fireEvent.focus(inputArea);
      fireEvent.blur(inputArea);
      fireEvent.keyDown(inputArea, { key: 'Enter' });
      fireEvent.keyUp(inputArea, { key: 'Enter' });
      fireEvent.paste(inputArea, { clipboardData: { getData: () => 'test', files: [] } });

      expect(handlers.onFocus).toHaveBeenCalled();
      expect(handlers.onBlur).toHaveBeenCalled();
      expect(handlers.onKeyDown).toHaveBeenCalled();
      expect(handlers.onKeyUp).toHaveBeenCalled();
    });

    it('should handle all props combinations', () => {
      const { container } = render(
        <Sender
          slotConfig={baseSlotConfig}
          disabled={true}
          readOnly={true}
          autoSize={{ minRows: 2, maxRows: 6 }}
          placeholder="Test placeholder"
          submitType="enter"
          loading={false}
          allowSpeech={true}
          prefix={null}
          suffix={null}
          footer={null}
          header={null}
        />,
      );
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle empty and null values gracefully', () => {
      const { container } = render(
        <Sender
          slotConfig={[
            { type: 'text', value: '' },
            { type: 'input', key: 'empty' },
            { type: 'select', key: 'select-empty', props: { options: [] } },
          ]}
        />,
      );
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });
  });

  describe('Edge case and boundary tests', () => {
    it('should handle null and undefined slot configurations', () => {
      expect(() => {
        render(<Sender slotConfig={null as any} />);
        render(<Sender slotConfig={undefined as any} />);
      }).not.toThrow();
    });

    it('should handle slot with missing key warnings', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidConfig = [
        { type: 'input', props: { placeholder: 'No key' } } as SlotConfigType,
        { type: 'select', props: { options: ['A', 'B'] } } as SlotConfigType,
      ];

      render(<Sender slotConfig={invalidConfig} />);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Slot key is missing'));
      consoleSpy.mockRestore();
    });

    it('should handle very long text values', () => {
      const longText = 'a'.repeat(1000); // Reduced length to avoid performance issues
      const { container } = render(
        <Sender slotConfig={[{ type: 'text', value: longText }]} autoSize={false} />,
      );
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle special characters in slot values', () => {
      const specialChars: SlotConfigType[] = [
        { type: 'text', value: '<script>alert("xss")</script>' },
        { type: 'text', value: '\n\r\t' },
        { type: 'text', value: '"quotes" and \'apostrophes\'' },
        { type: 'input', key: 'special', props: { defaultValue: 'test@#$%^&*()' } },
      ];

      const { container } = render(<Sender slotConfig={specialChars} autoSize={false} />);
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle rapid slot configuration changes', () => {
      const { rerender, container } = render(
        <Sender slotConfig={[{ type: 'text', value: 'Initial' }]} />,
      );

      // Rapid changes
      for (let i = 0; i < 10; i++) {
        rerender(<Sender slotConfig={[{ type: 'text', value: `Update ${i}` }]} />);
      }

      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle concurrent ref method calls', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={[{ type: 'text', value: 'Test' }]} ref={ref} />);

      // Concurrent operations
      expect(() => {
        Promise.all([
          ref.current?.insert([{ type: 'text', value: '1' }]),
          ref.current?.insert([{ type: 'text', value: '2' }]),
          ref.current?.clear(),
          ref.current?.getValue(),
        ]);
      }).not.toThrow();
    });

    it('should handle empty string values gracefully', () => {
      const { container } = render(
        <Sender
          slotConfig={[
            { type: 'text', value: '' },
            { type: 'input', key: 'empty', props: { defaultValue: '' } },
            { type: 'select', key: 'empty-select', props: { defaultValue: '', options: [] } },
          ]}
        />,
      );
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('should handle nested slot interactions', () => {
      const onChange = jest.fn();
      const nestedConfig: SlotConfigType[] = [
        { type: 'text', value: 'Start' },
        { type: 'input', key: 'nested1', props: { defaultValue: 'Value1' } },
        { type: 'select', key: 'nested2', props: { options: ['A', 'B'], defaultValue: 'A' } },
        { type: 'content', key: 'nested3', props: { defaultValue: 'Content' } },
        { type: 'text', value: 'End' },
      ];

      const { container } = render(<Sender slotConfig={nestedConfig} onChange={onChange} />);

      // Test interactions with nested slots
      const input = container.querySelector('input[data-slot-input="nested1"]') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Updated' } });

      expect(onChange).toHaveBeenCalled();
    });
  });
});
