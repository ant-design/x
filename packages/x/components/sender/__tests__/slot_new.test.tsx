import React, { createRef } from 'react';
import { fireEvent, render, waitFor } from '../../../tests/utils';
import Sender, { type SenderRef, type SlotConfigType } from '../index';

const textSlotConfig: SlotConfigType = { type: 'text', value: 'Text Value' };

const inputSlotConfig: SlotConfigType = {
  type: 'input',
  key: 'input1',
  props: { placeholder: 'Enter input' },
};

const inputSlotConfigWithValue: SlotConfigType = {
  type: 'input',
  key: 'input2',
  props: { defaultValue: 'Input Value', placeholder: 'Enter input 2' },
};

const contentSlotConfig: SlotConfigType = {
  type: 'content',
  key: 'content1',
  props: { placeholder: 'Enter content' },
};

const contentSlotConfigWithValue: SlotConfigType = {
  type: 'content',
  key: 'content2',
  props: { defaultValue: 'Content Value', placeholder: 'Enter content 2' },
};

const selectSlotConfig: SlotConfigType = {
  type: 'select',
  key: 'select1',
  props: { options: ['A', 'B'], placeholder: 'Select option' },
};

const selectSlotConfigWithValue: SlotConfigType = {
  type: 'select',
  key: 'select2',
  props: { options: ['A', 'B'], defaultValue: 'A', placeholder: 'Select option 2' },
};

const tagSlotConfig: SlotConfigType = {
  type: 'tag',
  key: 'tag1',
  props: { value: 'tag1', label: 'Tag Label' },
};

const customSlotConfig: SlotConfigType = {
  type: 'custom',
  key: 'custom1',
  props: {
    defaultValue: 'Custom Value',
  },
  customRender: (value: any, onChange: (value: any) => void) => (
    <button type="button" data-testid="custom-btn" onClick={() => onChange('custom-value')}>
      {value || 'Custom'}
    </button>
  ),
  formatResult: (v: any) => `[${v}]`,
};
describe('Sender Slot Component', () => {
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
    // 更完整的Selection mock
    const mockRange = {
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
      setStartAfter: jest.fn(),
      setEndAfter: jest.fn(),
      cloneRange: jest.fn(),
      toString: jest.fn(() => ''),
      deleteFromDocument: jest.fn(),
    };

    Object.defineProperty(window, 'getSelection', {
      value: () => ({
        rangeCount: 1,
        getRangeAt: () => mockRange,
        deleteFromDocument: jest.fn(),
        removeAllRanges: jest.fn(),
        addRange: jest.fn(),
        collapse: jest.fn(),
        selectAllChildren: jest.fn(),
      }),
      writable: true,
    });
  });
  it('should render all slot', async () => {
    const onChange = jest.fn();
    const slotConfig = [
      textSlotConfig,
      inputSlotConfig,
      selectSlotConfigWithValue,
      inputSlotConfigWithValue,
      contentSlotConfigWithValue,
      contentSlotConfig,
      selectSlotConfig,
      tagSlotConfig,
      customSlotConfig,
    ];
    const { getByText, getByPlaceholderText, getByDisplayValue } = render(
      <Sender slotConfig={slotConfig} onChange={onChange} />,
    );
    expect(getByText('Text Value')).toBeInTheDocument();

    expect(getByDisplayValue('Input Value')).toBeInTheDocument();
    expect(getByText('Content Value')).toBeInTheDocument();
    expect(getByText('Tag Label')).toBeInTheDocument();
    expect(getByText('Custom Value')).toBeInTheDocument();
    expect(getByText('A')).toBeInTheDocument();

    const input = getByPlaceholderText('Enter input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(input.value).toBe('New Value');

    const selectPlaceholder = document.querySelector(
      '[data-placeholder="Select option"]',
    ) as HTMLInputElement;
    expect(selectPlaceholder).toBeInTheDocument();

    fireEvent.click(selectPlaceholder);
    const optionB = await waitFor(() => getByText('B'));
    fireEvent.click(optionB);
    expect(onChange).toHaveBeenCalled();
  });
  it('should ref can be used', () => {
    const ref = createRef<SenderRef>();
    const slotConfig = [
      textSlotConfig,
      inputSlotConfig,
      selectSlotConfigWithValue,
      inputSlotConfigWithValue,
      contentSlotConfigWithValue,
      contentSlotConfig,
      selectSlotConfig,
      tagSlotConfig,
      customSlotConfig,
    ];
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    render(<Sender slotConfig={slotConfig} ref={ref} onFocus={onFocus} onBlur={onBlur} />);
    expect(ref.current).toBeDefined();
    expect(ref.current).not.toBeNull();
    expect(typeof ref.current?.nativeElement).toBe('object');
    expect(typeof ref.current?.focus).toBe('function');
    expect(typeof ref.current?.blur).toBe('function');
    expect(typeof ref.current?.clear).toBe('function');
    expect(typeof ref.current?.getValue).toBe('function');
    // ====================== focus =======================
    ref.current?.focus();
    ref.current?.focus({ cursor: 'end' });
    ref.current?.focus({ cursor: 'end', preventScroll: true });
    ref.current?.focus({ cursor: 'all' });
    ref.current?.focus({ cursor: 'all', preventScroll: true });
    ref.current?.focus({ cursor: 'start' });
    ref.current?.focus({ cursor: 'start', preventScroll: true });
    ref.current?.focus({
      cursor: 'slot',
    });
    ref.current?.focus({
      cursor: 'slot',
      key: 'input1',
    });
    ref.current?.focus({
      cursor: 'slot',
      key: 'content1',
    });
    ref.current?.focus({
      cursor: 'slot',
      key: 'select1',
    });
    expect(onFocus).toHaveBeenCalled();
    // ====================== focus =======================
    ref?.current?.blur();
    expect(onBlur).toHaveBeenCalled();
    // ====================== focus =======================
    const fullValue = ref.current?.getValue();
    expect(fullValue?.value).toBe('Text ValueAInput Value Content Value   tag1[Custom Value]');
    expect(fullValue?.slotConfig).toHaveLength(9);
    // ====================== clear =======================
    ref?.current?.clear();
    const clearedValue = ref.current?.getValue();
    expect(clearedValue?.value).toBe('');
    expect(clearedValue?.slotConfig).toEqual([]);
    expect(clearedValue?.skill).toBe(undefined);
  });
  describe('ref insert can be used', () => {
    it('should with no range can be used', () => {
      const ref = createRef<SenderRef>();
      const slotConfig = [textSlotConfig];
      render(<Sender slotConfig={slotConfig} ref={ref} />);
      expect(ref.current).toBeDefined();
      expect(ref.current).not.toBeNull();
      expect(typeof ref.current?.insert).toBe('function');
      ref.current?.insert([textSlotConfig]);
      ref.current?.insert([contentSlotConfig]);
      ref.current?.insert([inputSlotConfig]);
      ref.current?.insert([selectSlotConfig]);
      ref.current?.insert([inputSlotConfigWithValue, contentSlotConfigWithValue]);
      ref.current?.insert([textSlotConfig, tagSlotConfig]);
      ref.current?.insert([textSlotConfig], 'end');
      ref.current?.insert([contentSlotConfig], 'start');
    });
    it('should with range can be used', () => {
      const ref = createRef<SenderRef>();
      const slotConfig = [textSlotConfig, inputSlotConfig];
      const { getByText, getByPlaceholderText } = render(
        <Sender slotConfig={slotConfig} ref={ref} />,
      );
      expect(ref.current).toBeDefined();
      expect(ref.current).not.toBeNull();
      const textDom = getByText('Text Value');
      const mockRange = {
        startContainer: textDom,
        endContainer: textDom,
        startOffset: 2,
        endOffset: 2,
        collapse: jest.fn(),
        selectNodeContents: jest.fn(),
        deleteContents: jest.fn(),
        insertNode: jest.fn(),
        setStart: jest.fn(),
        setEnd: jest.fn(),
        setStartAfter: jest.fn(),
        setEndAfter: jest.fn(),
        cloneRange: jest.fn(),
        toString: jest.fn(() => ''),
        deleteFromDocument: jest.fn(),
      };
      Object.defineProperty(window, 'getSelection', {
        value: () => ({
          rangeCount: 1,
          getRangeAt: () => mockRange,
          removeAllRanges: jest.fn(),
          addRange: jest.fn(),
          collapse: jest.fn(),
          selectAllChildren: jest.fn(),
          deleteFromDocument: jest.fn(),
        }),
        writable: true,
      });
      expect(typeof ref.current?.insert).toBe('function');
      ref.current?.insert([textSlotConfig]);
      ref.current?.insert([contentSlotConfig]);

      const input = getByPlaceholderText('Enter input') as HTMLInputElement;
      const mockRangeInput = {
        startContainer: input,
        endContainer: input,
        startOffset: 2,
        endOffset: 2,
        collapse: jest.fn(),
        selectNodeContents: jest.fn(),
        deleteContents: jest.fn(),
        insertNode: jest.fn(),
        setStart: jest.fn(),
        setEnd: jest.fn(),
        setStartAfter: jest.fn(),
        setEndAfter: jest.fn(),
        cloneRange: jest.fn(),
        toString: jest.fn(() => ''),
        deleteFromDocument: jest.fn(),
      };
      Object.defineProperty(window, 'getSelection', {
        value: () => ({
          rangeCount: 1,
          getRangeAt: () => mockRangeInput,
          removeAllRanges: jest.fn(),
          addRange: jest.fn(),
          collapse: jest.fn(),
          selectAllChildren: jest.fn(),
          deleteFromDocument: jest.fn(),
        }),
        writable: true,
      });
      expect(input).toBeInTheDocument();
      ref.current?.insert([contentSlotConfig]);
    });
    it('should with replaceCharacters', () => {
      const ref = createRef<SenderRef>();
      const slotConfig: SlotConfigType[] = [{ type: 'text', value: 'Text Value@' }];
      const { getByText } = render(<Sender slotConfig={slotConfig} ref={ref} />);
      expect(ref.current).toBeDefined();
      expect(ref.current).not.toBeNull();
      const textDom = getByText('Text Value@');

      // Define the mock range type to avoid circular reference
      interface MockRange {
        startContainer: HTMLElement;
        endContainer: HTMLElement;
        startOffset: number;
        endOffset: number;
        collapse: jest.MockedFunction<() => void>;
        selectNodeContents: jest.MockedFunction<(node: Node) => void>;
        deleteContents: jest.MockedFunction<() => void>;
        insertNode: jest.MockedFunction<(node: Node) => void>;
        setStart: jest.MockedFunction<(node: Node, offset: number) => void>;
        setEnd: jest.MockedFunction<(node: Node, offset: number) => void>;
        setStartAfter: jest.MockedFunction<(node: Node) => void>;
        setEndAfter: jest.MockedFunction<(node: Node) => void>;
        cloneRange: jest.MockedFunction<() => MockRange>;
        toString: jest.MockedFunction<() => string>;
        deleteFromDocument: jest.MockedFunction<() => void>;
      }

      const mockRange: MockRange = {
        startContainer: textDom,
        endContainer: textDom,
        startOffset: 11,
        endOffset: 11,
        collapse: jest.fn(),
        selectNodeContents: jest.fn(),
        deleteContents: jest.fn(),
        insertNode: jest.fn(),
        setStart: jest.fn(),
        setEnd: jest.fn(),
        setStartAfter: jest.fn(),
        setEndAfter: jest.fn(),
        cloneRange: jest.fn(() => mockRange),
        toString: jest.fn(() => ''),
        deleteFromDocument: jest.fn(),
      };
      Object.defineProperty(window, 'getSelection', {
        value: () => ({
          rangeCount: 1,
          getRangeAt: () => mockRange,
          removeAllRanges: jest.fn(),
          addRange: jest.fn(),
          collapse: false,
          selectAllChildren: jest.fn(),
          deleteFromDocument: jest.fn(),
        }),
        writable: true,
      });
      expect(typeof ref.current?.insert).toBe('function');
      ref.current?.insert?.(
        [
          {
            type: 'content',
            key: `partner_2_${Date.now()}`,
            props: { placeholder: 'Enter a name' },
          },
        ],
        'cursor',
        '@',
      );
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
  describe('Events', () => {
    it('should handle all event callbacks', () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const onKeyUp = jest.fn();
      const onKeyDown = jest.fn();
      const onChange = jest.fn();
      const slotConfig = [textSlotConfig];
      const { container } = render(
        <Sender
          slotConfig={slotConfig}
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
    it('should handle paste events', () => {
      const onPasteFile = jest.fn();
      const slotConfig = [textSlotConfig];
      const { container } = render(<Sender slotConfig={slotConfig} onPasteFile={onPasteFile} />);

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
      const slotConfig = [textSlotConfig];
      const { container } = render(<Sender slotConfig={slotConfig} onPaste={onPaste} />);

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

      fireEvent.paste(inputArea, {
        clipboardData: {
          getData: () => 'pasted text',
          files: [],
        },
      });

      expect(onPaste).toHaveBeenCalled();
    });
    it('should handle onKeyDown', () => {
      const onKeyDown = jest.fn();
      const onSubmit = jest.fn();
      const slotConfig = [textSlotConfig];

      const ref = createRef<SenderRef>();
      render(
        <Sender ref={ref} slotConfig={slotConfig} onKeyDown={onKeyDown} onSubmit={onSubmit} />,
      );
      const dom = ref.current?.inputElement as HTMLElement;
      expect(ref.current).toBeDefined();
      expect(dom).toBeDefined();
      fireEvent.keyDown(dom, { key: 'Backspace' });
      expect(onKeyDown).toHaveBeenCalled();
      fireEvent.keyDown(dom, { key: 'a', ctrlKey: true });
      fireEvent.keyDown(dom, { key: 'Enter' });
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
