import React, { createRef } from 'react';
import { fireEvent, render, waitFor } from '../../../tests/utils';
import type { SenderRef, SlotConfigType } from '../index';
import Sender from '../index';

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
    <button type="button" data-testid="custom-btn" onClick={() => onChange('Custom Value Change')}>
      {value || 'Custom'}
    </button>
  ),
  formatResult: (v: any) => `[${v}]`,
};

const errorTypeSlotConfig: any = {
  type: 'error',
  key: 'error1',
};

interface MockRange {
  startContainer: HTMLElement;
  endContainer: HTMLElement;
  startOffset: number;
  endOffset: number;
  collapsed: boolean;
  collapse: jest.MockedFunction<() => void>;
  selectNodeContents: jest.MockedFunction<(node: Node) => void>;
  insertNode: jest.MockedFunction<(node: Node) => void>;
  setStart: jest.MockedFunction<(node: Node, offset: number) => void>;
  setEnd: jest.MockedFunction<(node: Node, offset: number) => void>;
  setStartAfter: jest.MockedFunction<(node: Node) => void>;
  setEndAfter: jest.MockedFunction<(node: Node) => void>;
  cloneRange: jest.MockedFunction<() => MockRange>;
  toString: any;
  deleteContents: jest.MockedFunction<() => void>;
}

// Mock 配置工具函数
const createMockRange = (config: Partial<MockRange> = {}): MockRange => {
  const mockRange: MockRange = {
    startContainer: document.createElement('div'),
    endContainer: document.createElement('div'),
    startOffset: 0,
    collapsed: false,
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
    ...config,
  };

  // 修复自引用问题
  mockRange.cloneRange = jest.fn(() => mockRange);

  return mockRange;
};

const setupDOMMocks = (selectionConfig: any = {}, rangeConfig: Partial<MockRange> = {}) => {
  // Mock document.createRange
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

  // 创建 mock range
  const mockRange = createMockRange(rangeConfig);

  // Mock window.getSelection
  Object.defineProperty(window, 'getSelection', {
    value: () => ({
      rangeCount: 1,
      getRangeAt: () => mockRange,
      deleteContents: jest.fn(),
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
      collapse: jest.fn(),
      selectAllChildren: jest.fn(),
      ...selectionConfig,
    }),
    writable: true,
  });

  return { mockRange };
};

describe('Sender Slot Component', () => {
  // Set up global DOM API mock
  beforeEach(() => {
    setupDOMMocks();
  });
  it('should render all slot types correctly', async () => {
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
    const { getByText, getByTestId, getByPlaceholderText, getByDisplayValue } = render(
      <Sender slotConfig={slotConfig} onChange={onChange} />,
    );
    expect(getByText('Text Value')).toBeInTheDocument();

    expect(getByDisplayValue('Input Value')).toBeInTheDocument();
    expect(getByText('Content Value')).toBeInTheDocument();
    expect(getByText('Tag Label')).toBeInTheDocument();
    expect(getByText('Custom Value')).toBeInTheDocument();
    expect(getByText('A')).toBeInTheDocument();
    // input

    const input = getByPlaceholderText('Enter input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(input.value).toBe('New Value');

    // select
    const selectPlaceholder = document.querySelector(
      '[data-placeholder="Select option"]',
    ) as HTMLInputElement;
    expect(selectPlaceholder).toBeInTheDocument();
    fireEvent.click(selectPlaceholder);
    const optionB = await waitFor(() => getByText('B'));
    fireEvent.click(optionB);
    expect(onChange).toHaveBeenCalled();

    // custom
    const customBtn = getByTestId('custom-btn');
    expect(customBtn.textContent).toBe('Custom Value');
    fireEvent.click(customBtn);
    expect(customBtn.textContent).toBe('Custom Value Change');
  });
  it('should expose ref methods correctly', () => {
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
      errorTypeSlotConfig,
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
    expect(fullValue?.slotConfig).toHaveLength(10);
    // ====================== clear =======================
    ref?.current?.clear();
    const clearedValue = ref.current?.getValue();
    expect(clearedValue?.value).toBe('');
    expect(clearedValue?.slotConfig).toEqual([]);
    expect(clearedValue?.skill).toBe(undefined);
  });
  describe('ref insert can be used', () => {
    it('should insert slots default selection range', () => {
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
    it('should insert slots without selection range', () => {
      window.getSelection = () => null;
      const ref = createRef<SenderRef>();
      const slotConfig = [textSlotConfig];
      render(<Sender slotConfig={slotConfig} ref={ref} />);
      expect(ref.current).toBeDefined();
      expect(ref.current).not.toBeNull();
      expect(typeof ref.current?.insert).toBe('function');
      ref.current?.insert([textSlotConfig]);
    });
    it('should insert slots with selection range', () => {
      const ref = createRef<SenderRef>();
      const slotConfig = [textSlotConfig, inputSlotConfig];
      const { getByText, getByPlaceholderText } = render(
        <Sender slotConfig={slotConfig} ref={ref} />,
      );
      expect(ref.current).toBeDefined();
      expect(ref.current).not.toBeNull();
      const textDom = getByText('Text Value');

      // 使用配置化的 mock
      const mockRange = createMockRange({
        startContainer: document.body,
        endContainer: textDom,
        startOffset: 2,
        endOffset: 2,
      });

      setupDOMMocks({}, mockRange);

      expect(typeof ref.current?.insert).toBe('function');
      ref.current?.insert([textSlotConfig]);
      ref.current?.insert([contentSlotConfig]);

      const input = getByPlaceholderText('Enter input') as HTMLInputElement;

      // 为 input 元素配置新的 mock
      const mockRangeInput = createMockRange({
        startContainer: input,
        endContainer: input,
        startOffset: 2,
        endOffset: 2,
      });

      setupDOMMocks({}, mockRangeInput);

      expect(input).toBeInTheDocument();
      ref.current?.insert([contentSlotConfig]);
    });
    it('should replace characters with slots at cursor position', () => {
      const ref = createRef<SenderRef>();
      const slotConfig: SlotConfigType[] = [{ type: 'text', value: 'Text Value@' }];
      const { getByText } = render(<Sender slotConfig={slotConfig} ref={ref} />);
      expect(ref.current).toBeDefined();
      expect(ref.current).not.toBeNull();
      const textDom = getByText('Text Value@');

      // 使用配置化的 mock
      const mockRange = createMockRange({
        startContainer: textDom,
        endContainer: textDom,
        startOffset: 11,
        endOffset: 11,
        toString: jest.fn(() => 'Text Value@'),
      });

      setupDOMMocks(
        {
          rangeCount: 1,
          collapse: false,
        },
        mockRange,
      );

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
    it('should insert slots with skill', () => {
      const ref = createRef<SenderRef>();
      const slotConfig = [textSlotConfig, inputSlotConfig];
      const { getByText, getByPlaceholderText } = render(
        <Sender
          skill={{
            value: 'test-skill',
            title: 'Test Skill',
          }}
          slotConfig={slotConfig}
          ref={ref}
        />,
      );
      expect(ref.current).toBeDefined();
      expect(ref.current).not.toBeNull();
      const textDom = getByText('Text Value');

      // 使用配置化的 mock
      const mockRange = createMockRange({
        startContainer: textDom,
        collapsed: true,
        endContainer: textDom,
        startOffset: 0,
        endOffset: 2,
      });

      setupDOMMocks({}, mockRange);

      expect(typeof ref.current?.insert).toBe('function');
      ref.current?.insert([textSlotConfig]);
      ref.current?.insert([contentSlotConfig]);

      const input = getByPlaceholderText('Enter input') as HTMLInputElement;

      // 为 input 元素配置新的 mock
      const mockRangeInput = createMockRange({
        startContainer: input,
        endContainer: input,
        startOffset: 2,
        endOffset: 2,
      });

      setupDOMMocks({}, mockRangeInput);

      expect(input).toBeInTheDocument();
      ref.current?.insert([contentSlotConfig]);
    });
  });
  describe('Skill functionality tests', () => {
    it('should render skill with close button', () => {
      const mockClose = jest.fn();
      const { container, getByText } = render(
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
      expect(getByText('Test Skill')).toBeInTheDocument();
      expect(container.querySelector('#ant-sender-slot-placeholders')).toBeInTheDocument();
    });
    it('should handle non-closable skill', () => {
      const { getByText } = render(
        <Sender
          slotConfig={[]}
          skill={{
            value: 'test-skill',
            closable: false,
          }}
        />,
      );

      expect(getByText('test-skill')).toBeInTheDocument();
    });
    it('should handle skill with placeholder', () => {
      const ref = createRef<SenderRef>();
      const { container } = render(
        <Sender
          ref={ref}
          slotConfig={[]}
          placeholder="Sender placeholder"
          skill={{
            value: 'test-skill',
            title: 'Test Skill',
          }}
        />,
      );
      const dom = ref.current?.inputElement as HTMLElement;
      const skillDom = container.querySelector('.ant-sender-skill-empty') as HTMLElement;
      expect(ref.current).toBeDefined();
      expect(skillDom).toBeDefined();

      const customSelectionMock = {
        rangeCount: 1,
        focusOffset: 0,
        anchorNode: skillDom.lastChild,
        removeAllRanges: jest.fn(),
        addRange: jest.fn(),
      };

      const customRangeMock = createMockRange();
      setupDOMMocks(customSelectionMock, customRangeMock);
      fireEvent.keyDown(dom, { key: 'Backspace' });
    });
    it('should handle skill removal via keyboard', () => {
      const ref = createRef<SenderRef>();
      const { container } = render(
        <Sender
          ref={ref}
          slotConfig={[]}
          placeholder="Sender placeholder"
          skill={{
            value: 'test-skill',
            title: 'Test Skill',
          }}
        />,
      );
      const dom = ref.current?.inputElement as HTMLElement;
      const skillDom = container.querySelector('.ant-sender-skill') as HTMLElement;
      expect(ref.current).toBeDefined();
      expect(skillDom).toBeDefined();

      const customSelectionMock = {
        rangeCount: 1,
        focusOffset: 0,
        anchorNode: dom,
        removeAllRanges: jest.fn(),
        addRange: jest.fn(),
      };

      Object.defineProperty(dom, 'previousSibling', {
        value: skillDom,
        configurable: true,
      });

      const customRangeMock = createMockRange();
      setupDOMMocks(customSelectionMock, customRangeMock);
      fireEvent.keyDown(dom, { key: 'Backspace' });
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
      rerender(<Sender slotConfig={[]} />);
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
  });
  describe('Events', () => {
    it('should handle all event callbacks', () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const onKeyUp = jest.fn();
      const onKeyDown = jest.fn<false | void, [React.KeyboardEvent<Element>]>(() => false);
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
    it('should handle onCompositionEnd event', () => {
      const slotConfig = [textSlotConfig];
      const ref = createRef<SenderRef>();
      render(<Sender ref={ref} slotConfig={slotConfig} />);
      // Directly trigger compositionend event on the DOM element
      const compositionEvent = new CompositionEvent('compositionend', {
        data: '测试文本',
        bubbles: true,
        cancelable: true,
      });

      ref.current?.inputElement?.dispatchEvent(compositionEvent);

      const compositionStartEvent = new CompositionEvent('compositionstart', {
        data: '测试文本',
        bubbles: true,
        cancelable: true,
      });

      ref.current?.inputElement?.dispatchEvent(compositionStartEvent);
      // The event should be handled without errors
      expect(ref.current?.inputElement).toBeInTheDocument();
    });
    it('should handle paste events', () => {
      const onPasteFile = jest.fn();
      document.execCommand = jest.fn();
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
      document.execCommand = undefined as any;
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
    it('should handle select all keyboard shortcut', () => {
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
      fireEvent.keyDown(dom, { key: 'a', ctrlKey: true });
      fireEvent.keyDown(dom, { key: 'Enter' });
      expect(onSubmit).toHaveBeenCalled();
    });
    it('should handle backspace key deletion', () => {
      const onSubmit = jest.fn();
      const slotConfig = [contentSlotConfigWithValue, textSlotConfig];
      const ref = createRef<SenderRef>();
      const { getByText } = render(
        <Sender ref={ref} slotConfig={slotConfig} onSubmit={onSubmit} />,
      );
      const dom = ref.current?.inputElement as HTMLElement;
      expect(ref.current).toBeDefined();
      expect(dom).toBeDefined();
      const contentDom = getByText('Content Value');
      const textDom = getByText('Text Value') as HTMLElement;
      expect(textDom).toBeTruthy();

      Object.defineProperty(textDom, 'previousSibling', {
        value: contentDom,
        configurable: true,
      });

      const customSelectionMock = {
        rangeCount: 1,
        focusOffset: 0,
        anchorNode: textDom,
        removeAllRanges: jest.fn(),
        addRange: jest.fn(),
      };

      const customRangeMock = createMockRange({
        startOffset: 5,
        endOffset: 10,
      });

      setupDOMMocks(customSelectionMock, customRangeMock);
      fireEvent.keyDown(dom, { key: 'Backspace' });
    });
    it('should handle backspace key in content slot', () => {
      const onSubmit = jest.fn();
      const slotConfig = [contentSlotConfigWithValue];
      const ref = createRef<SenderRef>();
      const { getByText } = render(
        <Sender ref={ref} slotConfig={slotConfig} onSubmit={onSubmit} />,
      );
      const dom = ref.current?.inputElement as HTMLElement;
      expect(ref.current).toBeDefined();
      expect(dom).toBeDefined();
      const contentElement = getByText('Content Value');
      let textDom: Node | null = null;
      // 遍历子节点找到文本节点
      for (let i = 0; i < contentElement.childNodes.length; i++) {
        const child = contentElement.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE) {
          textDom = child;
          break;
        }
      }

      if (!textDom) {
        textDom = contentElement.firstChild;
      }

      expect(textDom).toBeTruthy();
      expect(textDom?.nodeType).toBe(Node.TEXT_NODE);

      const customSelectionMock = {
        rangeCount: 1,
        focusOffset: 0,
        anchorNode: textDom,
        removeAllRanges: jest.fn(),
        addRange: jest.fn(),
      };

      const customRangeMock = createMockRange({
        startOffset: 0,
        endOffset: 12,
        collapsed: false,
        toString: jest.fn(() => 'Content Value'),
      });

      setupDOMMocks(customSelectionMock, customRangeMock);
      fireEvent.keyDown(dom, { key: 'Backspace' });
    });
    it('should handle cut operation in content slot', () => {
      const onSubmit = jest.fn();
      const slotConfig = [contentSlotConfigWithValue];
      const ref = createRef<SenderRef>();
      const { getByText } = render(
        <Sender ref={ref} slotConfig={slotConfig} onSubmit={onSubmit} />,
      );
      const dom = ref.current?.inputElement as HTMLElement;
      expect(ref.current).toBeDefined();
      expect(dom).toBeDefined();
      const contentElement = getByText('Content Value');
      let textDom: Node | null = null;
      // 遍历子节点找到文本节点
      for (let i = 0; i < contentElement.childNodes.length; i++) {
        const child = contentElement.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE) {
          textDom = child;
          break;
        }
      }

      if (!textDom) {
        textDom = contentElement.firstChild;
      }

      expect(textDom).toBeTruthy();
      expect(textDom?.nodeType).toBe(Node.TEXT_NODE);

      const customSelectionMock = {
        rangeCount: 1,
        focusOffset: 0,
        anchorNode: textDom,
        removeAllRanges: jest.fn(),
        addRange: jest.fn(),
      };

      const customRangeMock = createMockRange({
        startOffset: 0,
        endOffset: 12,
        collapsed: false,
        toString: jest.fn(() => 'Content Value'),
      });

      setupDOMMocks(customSelectionMock, customRangeMock);

      // Also test the cut event directly
      fireEvent.cut(dom, {
        clipboardData: {
          getData: () => 'Content Value',
          setData: jest.fn(),
        },
      });
    });
  });
});
