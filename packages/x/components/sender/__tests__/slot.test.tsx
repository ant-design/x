import { GetRef } from 'antd';
import React from 'react';
import { act, fireEvent, render } from '../../../tests/utils';
import Sender, { SlotConfigType } from '../index';
import SlotTextArea from '../SlotTextArea';

describe('Sender.SlotTextArea', () => {
  const slotConfig: SlotConfigType[] = [
    { type: 'text', value: 'Prefix text' },
    {
      type: 'input',
      key: 'input1',
      props: { placeholder: 'Please enter content', defaultValue: 'Default value' },
    },
    {
      type: 'select',
      key: 'select1',
      props: { options: ['A', 'B'], placeholder: 'Please select' },
    },
    { type: 'tag', key: 'tag1', props: { label: 'Tag' } },
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

  it('should render slotConfig', () => {
    const { getByText, getByTestId, getByPlaceholderText, container } = render(
      <Sender key="text" slotConfig={slotConfig} />,
    );
    // text slot
    expect(getByText('Prefix text')).toBeInTheDocument();
    // input slot placeholder
    expect(getByPlaceholderText('Please enter content')).toBeInTheDocument();
    // select slot placeholder
    expect(container.querySelector('[data-placeholder="Please select"]')).toBeInTheDocument();
    // tag slot label
    expect(getByText('Tag')).toBeInTheDocument();
    // custom slot button
    expect(getByTestId('custom-btn')).toBeInTheDocument();
  });

  it('should handle input slot change', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(<Sender slotConfig={slotConfig} onChange={onChange} />);
    const input = getByPlaceholderText('Please enter content') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New content' } });
    const calls = onChange.mock.calls;
    expect(calls[calls.length - 1][0]).toContain('New content');
  });

  it('should handle select slot change', () => {
    const onChange = jest.fn();
    const { container, getByText } = render(
      <Sender key="test" slotConfig={slotConfig} onChange={onChange} />,
    );
    // trigger dropdown
    fireEvent.click(container.querySelector('.ant-sender-slot-select')!);
    fireEvent.click(getByText('A'));
    expect(container.querySelector('.ant-dropdown-menu-title-content')?.textContent).toContain('A');
  });

  it('should handle custom slot interaction', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<Sender slotConfig={slotConfig} onChange={onChange} />);
    fireEvent.click(getByTestId('custom-btn'));
    expect(onChange).toHaveBeenCalledWith(
      expect.stringContaining('custom-value'),
      undefined,
      expect.any(Array),
    );
  });

  it('should trigger onSubmit', () => {
    const onSubmit = jest.fn();
    const { container } = render(<Sender slotConfig={slotConfig} onSubmit={onSubmit} />);
    // Submit by pressing Enter
    act(() => {
      fireEvent.keyDown(container.querySelector('[role="textbox"]')!, { key: 'Enter' });
    });
    expect(onSubmit).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
  });

  describe('submitType SlotTextArea', () => {
    it('default', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <Sender value="bamboo" slotConfig={slotConfig} onSubmit={onSubmit} />,
      );
      act(() => {
        fireEvent.keyDown(container.querySelector('[role="textbox"]')!, {
          key: 'Enter',
          shiftKey: false,
        });
      });
      expect(onSubmit).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
    });

    it('shiftEnter', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <Sender
          value="bamboo"
          slotConfig={slotConfig}
          onSubmit={onSubmit}
          submitType="shiftEnter"
        />,
      );
      act(() => {
        fireEvent.keyDown(container.querySelector('[role="textbox"]')!, {
          key: 'Enter',
          shiftKey: true,
        });
      });
      expect(onSubmit).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
    });
  });

  it('should have ref methods getValue/insert/clear', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    render(<Sender slotConfig={slotConfig} ref={ref} />);
    // insert
    ref?.current?.insert([{ type: 'text', value: 'Insert text' }]);
    expect(ref?.current?.getValue().value).toContain('Insert text');

    ref?.current?.insert?.([{ type: 'text', value: 'end' }], 'end');
    expect(ref?.current?.getValue().value).toContain('end');

    ref?.current?.insert([{ type: 'text', value: 'start' }], 'start');
    expect(ref?.current?.getValue().value).toContain('start');

    // clear
    ref?.current?.clear();
    expect(ref?.current?.getValue().value).toBe('');
  });

  it('should handle onPaste with text', () => {
    const onChange = jest.fn();
    const { container } = render(<Sender slotConfig={slotConfig} onChange={onChange} />);
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.paste(editable, {
      clipboardData: {
        getData: () => 'Paste content',
        files: { length: 0 },
      },
    });
    // After pasting, content should change
    expect(onChange).toHaveBeenCalled();
  });

  it('should handle onPaste with file', () => {
    const onPasteFile = jest.fn();
    const { container } = render(<Sender slotConfig={slotConfig} onPasteFile={onPasteFile} />);
    const editable = container.querySelector('.ant-sender-input')!;
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.paste(editable, {
      clipboardData: {
        files: { 0: file, length: 1, item: () => file },
        getData: () => '',
      },
    });
    expect(onPasteFile).toHaveBeenCalledWith(expect.anything());
  });

  it('should handle onPaste when clipboardData is empty', () => {
    const onPaste = jest.fn();
    const { container } = render(<Sender slotConfig={slotConfig} onPaste={onPaste} />);
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.paste(editable, {});
    expect(onPaste).toHaveBeenCalled();
  });

  it('should trigger onFocus/onBlur events', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { container } = render(
      <Sender slotConfig={slotConfig} onFocus={onFocus} onBlur={onBlur} />,
    );
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.focus(editable);
    fireEvent.blur(editable);
    expect(onFocus).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });

  it('should not trigger onSubmit during composition input', () => {
    const onSubmit = jest.fn();
    const { container } = render(<Sender slotConfig={slotConfig} onSubmit={onSubmit} />);
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.compositionStart(editable);
    fireEvent.keyUp(editable, { key: 'Enter' });
    fireEvent.compositionEnd(editable);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should have ref methods focus/blur', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    render(<Sender slotConfig={slotConfig} ref={ref} />);
    expect(typeof ref?.current?.focus).toBe('function');
    expect(typeof ref?.current?.blur).toBe('function');
    ref?.current?.focus({ cursor: 'start' });
    ref?.current?.focus({ cursor: 'end' });
    ref?.current?.focus({ cursor: 'all' });
    ref?.current?.focus({ cursor: 'slot' });
    ref?.current?.blur();
  });

  it('should be plain text editing when slotConfig is empty', () => {
    const onChange = jest.fn();
    const { container } = render(<Sender onChange={onChange} />);
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.input(editable, { target: { textContent: 'Plain text' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('should reset content when slotConfig changes', () => {
    const { rerender, container } = render(
      <Sender key="A" slotConfig={[{ type: 'text', value: 'A' }]} />,
    );
    expect(container.textContent).toContain('A');
    rerender(<Sender key="B" slotConfig={[{ type: 'text', value: 'B' }]} />);
    expect(container.textContent).toContain('B');
  });

  it('should initialize when slotConfig is undefined', () => {
    // Directly render SlotTextArea
    expect(() => {
      render(<SlotTextArea />);
    }).not.toThrow();
  });

  it('should return null from renderSlot when slotConfig has type but no key', () => {
    const { container } = render(
      <Sender
        slotConfig={[
          {
            type: 'input',
            key: 'input1',
            props: { defaultValue: '默认值', placeholder: '请输入内容' },
          },
        ]}
      />,
    );
    // Should not display any content
    expect(container.textContent).toBe('');
  });

  it('should cover editor?.focus() branch when ref.focus() is called without arguments', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    render(<Sender slotConfig={slotConfig} ref={ref} />);

    ref?.current?.focus();

    expect(typeof ref?.current?.focus).toBe('function');
  });

  it('should render and update input slot', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    const slotConfig: SlotConfigType[] = [
      {
        type: 'input',
        key: 'input1',
        props: { placeholder: '请输入内容', defaultValue: '默认值' },
      },
    ];
    const { getByPlaceholderText } = render(<Sender slotConfig={slotConfig} ref={ref} />);
    // Should render input with correct placeholder
    const input = getByPlaceholderText('请输入内容');
    expect(input).toBeInTheDocument();
    // Should have initial value
    expect(ref?.current?.getValue().value).toContain('默认值');
    // Should update value after change
    fireEvent.change(input, { target: { value: '新内容' } });
    expect(ref?.current?.getValue().value).toContain('新内容');
  });

  it('should test select slot', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    const slotConfig: SlotConfigType[] = [
      { type: 'select', key: 'select1', props: { options: ['A', 'B'], placeholder: '请选择' } },
    ];
    const { container, getByText } = render(<Sender slotConfig={slotConfig} ref={ref} />);
    // Select option A
    fireEvent.click(container.querySelector('.ant-sender-slot-select')!);
    fireEvent.click(getByText('A'));
    expect(ref?.current?.getValue().value).toContain('A');
  });

  it('should test tag slot', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    const slotConfig: SlotConfigType[] = [
      { type: 'tag', key: 'tag1', props: { label: 'Tag', value: 'Value' } },
    ];
    render(<Sender slotConfig={slotConfig} ref={ref} />);
    // Tag slot only shows label
    expect(ref?.current?.getValue().value).toContain('Value');
  });

  it('should test custom slot', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    const slotConfig: SlotConfigType[] = [
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
    const { getByTestId } = render(<Sender slotConfig={slotConfig} ref={ref} />);
    // Initial value
    expect(ref?.current?.getValue().value).toBe('[]');
    // Click custom button
    fireEvent.click(getByTestId('custom-btn'));
    expect(ref?.current?.getValue().value).toBe('[custom-value]');
  });

  it('should call insert when speech input and slotConfig exists', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    const testSlotConfig = [
      { type: 'input' as const, key: 'input1', props: { placeholder: 'Please enter content' } },
    ];
    render(<Sender slotConfig={testSlotConfig} allowSpeech ref={ref} />);
    ref?.current?.insert([{ type: 'text', value: 'Speech content' }], 'cursor', '@');

    expect(ref?.current?.getValue().value).toContain('Speech content');
  });

  it('should call insert slot', () => {
    const senderRef = React.createRef<GetRef<typeof Sender>>();
    const testSlotConfig = [
      { type: 'input' as const, key: 'input1', props: { placeholder: 'Please enter content' } },
    ];

    (globalThis.getSelection as any) = () => null;

    render(<Sender slotConfig={testSlotConfig} ref={senderRef} />);
    senderRef?.current?.insert(
      [{ type: 'tag', key: 'tag_1', props: { label: 'Tag_1', value: 'Tag1' } }],
      'end',
    );
    senderRef?.current?.focus({ cursor: 'slot', key: 'tag_1' });
  });
  it('should call triggerValueChange when speech input and slotConfig does not exist', () => {
    const onChange = jest.fn();
    const { container } = render(<Sender allowSpeech onChange={onChange} />);
    const textarea = container.querySelector('textarea')!;
    fireEvent.change(textarea, { target: { value: 'Speech content' } });
    const call = onChange.mock.calls[0];
    expect(call[0]).toBe('Speech content');
  });

  it('should not trigger onSubmit when loading is true and send button is clicked', () => {
    const onSubmit = jest.fn();
    const { container } = render(<Sender loading value="test" onSubmit={onSubmit} />);
    fireEvent.click(container.querySelector('button')!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should not trigger onSubmit when value is empty and send button is clicked', () => {
    const onSubmit = jest.fn();
    const { container } = render(<Sender value="" onSubmit={onSubmit} />);
    fireEvent.click(container.querySelector('button')!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should call clear when clear button is clicked and slotConfig exists', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    const testInitialSlotConfig = [
      { type: 'input' as const, key: 'input1', props: { placeholder: 'Please enter content' } },
    ];
    render(<Sender slotConfig={testInitialSlotConfig} ref={ref} />);
    ref?.current?.insert([{ type: 'text', value: 'Clear me' }]);
    ref?.current?.clear();
    expect(ref?.current?.getValue().value).toBe('');
  });

  it('should only clear value when clear button is clicked and slotConfig does not exist', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    render(<Sender ref={ref} />);
    ref?.current?.insert([{ type: 'text', value: 'Clear me' }]);
    ref?.current?.clear();
    expect(ref?.current?.getValue().value).toBe('');
  });

  it('should render speech button when allowSpeech is true', () => {
    const { container } = render(<Sender allowSpeech />);
    expect(container.querySelector('.anticon-audio-muted,.anticon-audio')).toBeTruthy();
  });

  it('should render LoadingButton when loading is true', () => {
    const { container } = render(<Sender loading />);
    // Should render loading icon
    expect(container.querySelector('[class*="loading-icon"]')).toBeTruthy();
  });

  it('should render SendButton when loading is false', () => {
    const { container } = render(<Sender loading={false} />);
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('should render custom suffix when suffix is a function', () => {
    const { getByText } = render(<Sender suffix={() => <div>Custom Button</div>} />);
    expect(getByText('Custom Button')).toBeInTheDocument();
  });

  it('should render suffix when suffix is a ReactNode', () => {
    const { getByText } = render(<Sender suffix={<div>Node Button</div>} />);
    expect(getByText('Node Button')).toBeInTheDocument();
  });

  it('should not render suffix when suffix is false', () => {
    const { container } = render(<Sender suffix={false} />);
    expect(container.querySelector('.ant-sender-actions-list')).toBeNull();
  });

  it('should prevent default and focus when clicking content area (not input) and slotConfig does not exist', () => {
    const { container } = render(<Sender />);
    const content = container.querySelector('.ant-sender-content')!;
    const event = new window.MouseEvent('mousedown', { bubbles: true, cancelable: true });
    content.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should not prevent default when clicking content area and slotConfig exists', () => {
    const slotConfig = [
      { type: 'input' as const, key: 'input1', props: { placeholder: 'Please enter content' } },
    ];
    const { container } = render(<Sender slotConfig={slotConfig} />);
    const content = container.querySelector('.ant-sender-content')!;
    const preventDefault = jest.fn();
    fireEvent.mouseDown(content, { target: content, preventDefault });
    // Should not prevent default when slotConfig exists
    expect(preventDefault).not.toHaveBeenCalled();
  });
});

describe('SlotTextArea Comprehensive Tests', () => {
  const mockSlotConfig: SlotConfigType[] = [
    { type: 'text', value: 'Hello ' },
    {
      type: 'input',
      key: 'name',
      props: { placeholder: 'Enter name', defaultValue: 'World' },
    },
    { type: 'text', value: '!' },
    {
      type: 'select',
      key: 'option',
      props: { options: ['A', 'B', 'C'], placeholder: 'Select option' },
    },
    { type: 'tag', key: 'tag1', props: { label: 'Important', value: 'tag-value' } },
    {
      type: 'custom',
      key: 'custom1',
      customRender: (value: any, onChange: (value: any) => void, { disabled }) => (
        <button
          type="button"
          data-testid="custom-btn"
          disabled={disabled}
          onClick={() => onChange(`custom-${value || 'empty'}`)}
        >
          {value || 'Custom'}
        </button>
      ),
      formatResult: (v: any) => `[${v}]`,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Ref Methods - Edge Cases', () => {
    it('should handle focus with different cursor options', () => {
      const ref = React.createRef<GetRef<typeof Sender>>();
      render(<Sender slotConfig={mockSlotConfig} ref={ref} />);

      expect(() => {
        ref.current?.focus({ cursor: 'start' });
        ref.current?.focus({ cursor: 'end' });
        ref.current?.focus({ cursor: 'all' });
        ref.current?.focus({ cursor: 'slot' });
        ref.current?.focus({ cursor: 'slot', key: 'non-existent' });
      }).not.toThrow();
    });

    it('should handle insert with different positions', () => {
      const ref = React.createRef<GetRef<typeof Sender>>();
      render(<Sender slotConfig={mockSlotConfig} ref={ref} />);

      // Test that insert methods work without throwing
      expect(() => {
        ref.current?.insert([{ type: 'text', value: 'Start' }], 'start');
        ref.current?.insert([{ type: 'text', value: 'End' }], 'end');
        ref.current?.insert([{ type: 'text', value: 'Cursor' }], 'cursor');
      }).not.toThrow();

      // Verify the component still works after insert operations
      expect(ref.current?.getValue()).toBeDefined();
    });

    it('should handle insert with replaceCharacters', () => {
      const ref = React.createRef<GetRef<typeof Sender>>();
      render(<Sender slotConfig={mockSlotConfig} ref={ref} />);

      ref.current?.insert([{ type: 'text', value: 'Replaced' }], 'cursor', 'Hello');
      expect(ref.current?.getValue().value).toBeTruthy();
    });

    it('should handle clear method', () => {
      const ref = React.createRef<GetRef<typeof Sender>>();
      render(<Sender slotConfig={mockSlotConfig} ref={ref} />);

      // Test that clear method works without throwing
      expect(() => {
        ref.current?.insert([{ type: 'text', value: 'To be cleared' }]);
        ref.current?.clear();
      }).not.toThrow();

      // Verify the component still works after clear operation
      expect(ref.current?.getValue()).toBeDefined();
    });

    it('should handle getValue with complex content', () => {
      const ref = React.createRef<GetRef<typeof Sender>>();
      const complexConfig: SlotConfigType[] = [
        { type: 'text', value: 'Complex ' },
        { type: 'input', key: 'test', props: { defaultValue: 'test-value' } },
        { type: 'text', value: ' content' },
      ];

      render(<Sender slotConfig={complexConfig} ref={ref} />);
      const value = ref.current?.getValue();

      expect(value?.value).toContain('Complex test-value content');
      expect(value?.config).toHaveLength(3);
      expect(value?.config[1].value).toBe('test-value');
    });
  });

  describe('Event Handlers - Edge Cases', () => {
    it('should handle keyboard events with modifiers', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <Sender slotConfig={mockSlotConfig} onSubmit={onSubmit} submitType="enter" />,
      );

      const editable = container.querySelector('[role="textbox"]')!;

      fireEvent.keyDown(editable, { key: 'Enter', ctrlKey: true });
      expect(onSubmit).not.toHaveBeenCalled();

      fireEvent.keyDown(editable, { key: 'Enter', altKey: true });
      expect(onSubmit).not.toHaveBeenCalled();

      fireEvent.keyDown(editable, { key: 'Enter', metaKey: true });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should handle shift+enter submission', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <Sender slotConfig={mockSlotConfig} onSubmit={onSubmit} submitType="shiftEnter" />,
      );

      const editable = container.querySelector('[role="textbox"]')!;

      fireEvent.keyDown(editable, { key: 'Enter', shiftKey: true });
      expect(onSubmit).toHaveBeenCalled();
    });

    it('should handle non-enter keys', () => {
      const onKeyDown = jest.fn();
      const { container } = render(<Sender slotConfig={mockSlotConfig} onKeyDown={onKeyDown} />);

      const editable = container.querySelector('[role="textbox"]')!;

      fireEvent.keyDown(editable, { key: 'Tab' });
      fireEvent.keyDown(editable, { key: 'Escape' });
      fireEvent.keyDown(editable, { key: 'Space' });

      expect(onKeyDown).toHaveBeenCalledTimes(3);
    });

    it('should handle paste with malformed data', () => {
      const onChange = jest.fn();
      const { container } = render(<Sender slotConfig={mockSlotConfig} onChange={onChange} />);

      const editable = container.querySelector('[role="textbox"]')!;

      fireEvent.paste(editable, {
        clipboardData: {
          getData: () => '',
          files: { length: 0 },
        },
      });

      expect(onChange).toHaveBeenCalled();
    });

    it('should handle paste with large text', () => {
      const onChange = jest.fn();
      const { container } = render(<Sender slotConfig={mockSlotConfig} onChange={onChange} />);

      const editable = container.querySelector('[role="textbox"]')!;
      const largeText = 'A'.repeat(1000);

      fireEvent.paste(editable, {
        clipboardData: {
          getData: () => largeText,
          files: { length: 0 },
        },
      });

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Slot Types - Edge Cases', () => {
    it('should handle input slot with readOnly state', () => {
      const { getByPlaceholderText } = render(
        <Sender
          slotConfig={[
            { type: 'input', key: 'test', props: { placeholder: 'Test', defaultValue: 'value' } },
          ]}
          readOnly
        />,
      );

      const input = getByPlaceholderText('Test') as HTMLInputElement;
      expect(input).toHaveAttribute('readonly');
    });

    it('should handle select slot with empty options', () => {
      const { container } = render(
        <Sender
          slotConfig={[
            { type: 'select', key: 'test', props: { options: [], placeholder: 'Select' } },
          ]}
        />,
      );

      const select = container.querySelector('.ant-sender-slot-select');
      expect(select).toBeInTheDocument();
    });

    it('should handle select slot with disabled state', () => {
      const { container } = render(
        <Sender
          slotConfig={[
            {
              type: 'select',
              key: 'test',
              props: { options: ['A', 'B'], placeholder: 'Select' },
            },
          ]}
          readOnly
        />,
      );

      const select = container.querySelector('.ant-sender-slot-select');
      expect(select).toBeInTheDocument();
    });

    it('should handle tag slot with missing props', () => {
      const ref = React.createRef<GetRef<typeof Sender>>();
      render(
        <Sender
          slotConfig={[
            { type: 'tag', key: 'test' }, // Missing label and value
          ]}
          ref={ref}
        />,
      );

      const value = ref.current?.getValue();
      expect(value?.value).toBe('');
    });
  });

  describe('Edge Cases & Error Handling', () => {
    it('should handle null/undefined slotConfig', () => {
      const { rerender } = render(<Sender slotConfig={undefined} />);

      rerender(<Sender slotConfig={null as any} />);

      expect(document.querySelector('.ant-sender-input')).toBeInTheDocument();
    });

    it('should handle empty slotConfig', () => {
      const ref = React.createRef<GetRef<typeof Sender>>();
      render(<Sender slotConfig={[]} ref={ref} />);

      expect(ref.current?.getValue().value).toBe('');
      expect(ref.current?.getValue().config).toEqual([]);
    });
  });

  describe('Composition Input', () => {
    it('should handle composition start/end lifecycle', () => {
      const onChange = jest.fn();
      const { container } = render(<Sender slotConfig={mockSlotConfig} onChange={onChange} />);

      const editable = container.querySelector('[role="textbox"]')!;

      fireEvent.compositionStart(editable);
      fireEvent.keyDown(editable, { key: 'Enter' });

      fireEvent.compositionEnd(editable);

      fireEvent.input(editable, { target: { textContent: 'Composed text' } });
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('FormatResult Functionality', () => {
    it('should apply formatResult to slot values', () => {
      const ref = React.createRef<GetRef<typeof Sender>>();
      const formatConfig: SlotConfigType[] = [
        {
          type: 'input',
          key: 'formatted',
          props: { defaultValue: 'test' },
          formatResult: (value: string) => `FORMATTED-${value}`,
        },
      ];

      render(<Sender slotConfig={formatConfig} ref={ref} />);

      const value = ref.current?.getValue();
      expect(value?.value).toBe('FORMATTED-test');
    });

    it('should handle formatResult returning empty string', () => {
      const ref = React.createRef<GetRef<typeof Sender>>();
      const formatConfig: SlotConfigType[] = [
        {
          type: 'input',
          key: 'empty',
          props: { defaultValue: 'test' },
          formatResult: () => '',
        },
      ];

      render(<Sender slotConfig={formatConfig} ref={ref} />);

      const value = ref.current?.getValue();
      // The formatResult should be applied to the slot value
      expect(value?.config[0].formatResult).toBeDefined();
    });
  });

  describe('Memory & Cleanup', () => {
    it('should cleanup on unmount', () => {
      const { unmount } = render(<Sender slotConfig={mockSlotConfig} />);

      expect(() => unmount()).not.toThrow();
    });
  });
});
