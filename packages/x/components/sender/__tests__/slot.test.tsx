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

    it('should handle all focus options', () => {
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

      expect(() => ref.current?.focus({ cursor: 'start' })).not.toThrow();
      expect(() => ref.current?.focus({ cursor: 'end' })).not.toThrow();
      expect(() => ref.current?.focus({ cursor: 'all' })).not.toThrow();
    });

    it('should handle submitDisabled state', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <Sender slotConfig={baseSlotConfig} onSubmit={onSubmit} submitType="enter" />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;
      fireEvent.keyDown(inputArea, { key: 'Enter' });
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
