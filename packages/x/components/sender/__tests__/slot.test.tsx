import React from 'react';
import { fireEvent, render } from '../../../tests/utils';
import Sender, { SlotConfigType } from '../index';

describe('Sender.SlotTextArea', () => {
  const slotConfig: SlotConfigType[] = [
    { type: 'text', value: 'Prefix text' },
    {
      type: 'input',
      key: 'input1',
      props: { placeholder: 'Please enter input', defaultValue: 'Default value' },
    },
    {
      type: 'content',
      key: 'content1',
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
    expect(getByText('Prefix text')).toBeInTheDocument();
    expect(getByPlaceholderText('Please enter input')).toBeInTheDocument();
    expect(container.querySelector('[data-placeholder="Please select"]')).toBeInTheDocument();
    expect(getByText('Tag')).toBeInTheDocument();
    expect(getByTestId('custom-btn')).toBeInTheDocument();
  });
  it('Backspace', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Sender
        slotConfig={[
          {
            type: 'content',
            key: 'content1',
            props: { placeholder: 'Please enter content', defaultValue: 'Default value' },
          },
        ]}
        onChange={onChange}
      />,
    );

    const editable = container.querySelector('[role="textbox"]')!;

    fireEvent.compositionStart(editable);
    fireEvent.keyDown(editable, { key: 'Backspace' });
  });

  it('autoSize', () => {
    render(<Sender autoSize slotConfig={slotConfig} />);
    render(<Sender autoSize={false} slotConfig={slotConfig} />);
    render(
      <Sender
        autoSize={{
          minRows: 2,
          maxRows: 6,
        }}
        slotConfig={slotConfig}
      />,
    );
  });

  it('should handle input slot interaction', () => {
    const { getByPlaceholderText } = render(<Sender key="text" slotConfig={slotConfig} />);
    const input = getByPlaceholderText('Please enter input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New input value' } });
    expect(input.value).toBe('New input value');
  });
  it('should handle non-enter keys', () => {
    const onKeyDown = jest.fn();
    const { container } = render(<Sender slotConfig={slotConfig} onKeyDown={onKeyDown} />);

    const editable = container.querySelector('[role="textbox"]')!;

    fireEvent.keyDown(editable, { key: 'Tab' });
    fireEvent.keyDown(editable, { key: 'Escape' });
    fireEvent.keyDown(editable, { key: 'Space' });

    expect(onKeyDown).toHaveBeenCalledTimes(3);
  });
  it('should handle custom slot interaction', () => {
    const { getByTestId } = render(<Sender key="text" slotConfig={slotConfig} />);
    const customBtn = getByTestId('custom-btn');
    expect(customBtn.textContent).toBe('Custom');
    fireEvent.click(customBtn);
    expect(customBtn.textContent).toBe('custom-value');
  });

  it('should format slot results correctly', () => {
    const { getByTestId } = render(<Sender key="text" slotConfig={slotConfig} />);
    const customBtn = getByTestId('custom-btn');
    fireEvent.click(customBtn);
    const customSlot = slotConfig[5] as any;
    expect(customSlot.formatResult('custom-value')).toBe('[custom-value]');
  });

  it('should handle content type slot', () => {
    const contentSlotConfig: SlotConfigType[] = [
      {
        type: 'content',
        key: 'content1',
        props: { placeholder: 'Enter content here' },
      },
    ];

    const { container } = render(<Sender key="text" slotConfig={contentSlotConfig} />);

    const inputArea = container.querySelector('[role="textbox"]');
    expect(inputArea).toBeInTheDocument();
  });

  it('should expose ref methods', () => {
    const ref = React.createRef<any>();
    render(<Sender key="text" slotConfig={slotConfig} ref={ref} />);

    expect(ref.current).toBeDefined();
    expect(typeof ref.current.focus).toBe('function');
    expect(typeof ref.current.blur).toBe('function');
    expect(typeof ref.current.clear).toBe('function');
    expect(typeof ref.current.getValue).toBe('function');
  });

  it('should handle custom slot without formatResult', () => {
    const customSlotConfig: SlotConfigType[] = [
      {
        type: 'custom',
        key: 'custom2',
        customRender: (value: any, onChange: (value: any) => void) => (
          <button type="button" data-testid="custom-btn-2" onClick={() => onChange('test')}>
            {value || 'Test'}
          </button>
        ),
      },
    ];

    const { getByTestId } = render(<Sender key="text" slotConfig={customSlotConfig} />);

    const customBtn = getByTestId('custom-btn-2');
    expect(customBtn).toBeInTheDocument();
  });

  it('should handle tag slot without props', () => {
    const tagConfig: SlotConfigType[] = [{ type: 'tag', key: 'tag3' }];

    const { container } = render(<Sender key="text" slotConfig={tagConfig} />);

    const tagElement = container.querySelector('.ant-sender-slot-tag');
    expect(tagElement).toBeInTheDocument();
  });

  it('should handle empty slotConfig', () => {
    const { container } = render(<Sender key="text" slotConfig={[]} />);

    const inputArea = container.querySelector('[role="textbox"]');
    expect(inputArea).toBeInTheDocument();
  });

  it('should handle slot with missing key', () => {
    const invalidSlotConfig: SlotConfigType[] = [
      { type: 'input', props: { placeholder: 'No key input' } } as SlotConfigType,
    ];

    const { container } = render(<Sender key="text" slotConfig={invalidSlotConfig} />);

    const inputArea = container.querySelector('[role="textbox"]');
    expect(inputArea).toBeInTheDocument();
  });

  it('should handle ref methods correctly', () => {
    const ref = React.createRef<any>();
    render(<Sender key="text" slotConfig={slotConfig} ref={ref} />);

    const value = ref.current?.getValue();
    expect(value).toBeDefined();
    expect(typeof value?.value).toBe('string');
    expect(Array.isArray(value?.slotConfig)).toBe(true);

    ref.current?.focus();
    ref.current?.focus({
      cursor: 'slot',
    });
    ref.current?.focus({
      cursor: 'slot',
      slotKey: 'input1',
    });
    ref.current?.focus({
      cursor: 'slot',
      slotKey: 'content1',
    });
    ref.current?.focus({
      cursor: 'start',
    });
    ref.current?.focus({
      cursor: 'all',
    });
    ref.current?.focus({
      cursor: 'slot',
      slotKey: 'content2',
    });
    ref.current?.focus({
      cursor: 'end',
    });
    ref.current?.insert?.(
      [
        {
          type: 'input',
          key: `partner_2_${Date.now()}`,
          props: { placeholder: 'Enter a name' },
        },
      ],
      'cursor',
      '@',
    );

    ref.current?.clear();
  });

  it('should handle keyboard events', () => {
    const mockSubmit = jest.fn();
    render(<Sender key="text" slotConfig={slotConfig} onSubmit={mockSubmit} />);

    const inputArea = document.querySelector('[role="textbox"]') as HTMLElement;
    expect(inputArea).toBeInTheDocument();
    fireEvent.keyDown(inputArea, { key: 'Enter', code: 'Enter' });
  });

  it('should handle paste events', () => {
    const mockPasteFile = jest.fn();
    render(<Sender key="text" slotConfig={slotConfig} onPasteFile={mockPasteFile} />);

    const inputArea = document.querySelector('[role="textbox"]') as HTMLElement;
    expect(inputArea).toBeInTheDocument();

    fireEvent.paste(inputArea, {
      clipboardData: {
        getData: (format: string) => (format === 'text/plain' ? 'pasted text' : ''),
        files: [],
      },
    });
  });

  it('should handle focus and blur events', () => {
    const mockFocus = jest.fn();
    const mockBlur = jest.fn();
    render(<Sender key="text" slotConfig={slotConfig} onFocus={mockFocus} onBlur={mockBlur} />);

    const inputArea = document.querySelector('[role="textbox"]') as HTMLElement;
    expect(inputArea).toBeInTheDocument();
    fireEvent.focus(inputArea);
    fireEvent.blur(inputArea);
  });

  it('should handle composition events', () => {
    render(<Sender key="text" slotConfig={slotConfig} />);

    const inputArea = document.querySelector('[role="textbox"]') as HTMLElement;
    expect(inputArea).toBeInTheDocument();
    fireEvent.compositionStart(inputArea);
    fireEvent.compositionEnd(inputArea);
  });

  it('should handle insert method', () => {
    const ref = React.createRef<any>();
    render(<Sender key="text" slotConfig={slotConfig} ref={ref} />);

    ref.current?.insert([{ type: 'text', value: 'inserted text' }]);
    ref.current?.insert([{ type: 'text', value: 'start text' }], 'start');
    ref.current?.insert([{ type: 'text', value: 'end text' }], 'end');
  });

  it('should handle insert with replaceCharacters', () => {
    const ref = React.createRef<any>();
    render(<Sender key="text" slotConfig={[{ type: 'text', value: 'Hello @world' }]} ref={ref} />);

    // Test replaceCharacters functionality
    const inputArea = document.querySelector('[role="textbox"]') as HTMLElement;
    inputArea.focus();

    // Set cursor at the end
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(inputArea);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    ref.current?.insert(
      [{ type: 'input', key: 'name', props: { placeholder: 'Enter name' } }],
      'cursor',
      '@world',
    );
  });

  it('should handle focus with different cursor options', () => {
    const ref = React.createRef<any>();
    render(<Sender key="text" slotConfig={slotConfig} ref={ref} />);

    // Test focus with different cursor options
    ref.current?.focus({ cursor: 'start' });
    ref.current?.focus({ cursor: 'end' });
    ref.current?.focus({ cursor: 'all' });
    ref.current?.focus({ cursor: 'slot', key: 'input1' });
    ref.current?.focus({ cursor: 'slot', key: 'nonexistent' });
  });

  it('should handle removeSpecificBRs with different submitType', () => {
    const { container } = render(
      <Sender key="text" slotConfig={[{ type: 'text', value: 'Test' }]} submitType="shiftEnter" />,
    );

    const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;
    expect(inputArea).toBeInTheDocument();

    // Add a br tag and test removal
    inputArea.innerHTML = 'Test<br>';
    fireEvent.input(inputArea);
  });

  it('should handle Backspace key with slot deletion', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Sender
        slotConfig={[
          {
            type: 'input',
            key: 'test-input',
            props: { placeholder: 'Test input' },
          },
        ]}
        onChange={onChange}
      />,
    );

    const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

    // Test Backspace with composition
    fireEvent.compositionStart(inputArea);
    fireEvent.keyDown(inputArea, { key: 'Backspace' });
    fireEvent.compositionEnd(inputArea);

    // Test Backspace with key lock
    fireEvent.keyDown(inputArea, { key: 'Backspace' });
  });

  it('should handle select slot dropdown interaction', () => {
    const { container, getByText } = render(
      <Sender
        slotConfig={[
          {
            type: 'select',
            key: 'select-test',
            props: { options: ['Option A', 'Option B'], placeholder: 'Select option' },
          },
        ]}
      />,
    );

    const selectTrigger = container.querySelector('.ant-sender-slot-select');
    expect(selectTrigger).toBeInTheDocument();

    if (selectTrigger) {
      fireEvent.click(selectTrigger);

      // Test dropdown option selection
      const optionA = getByText('Option A');
      fireEvent.click(optionA);
    }
  });

  it('should render skill', () => {
    const mockClose = jest.fn();
    const { getByText } = render(
      <Sender
        key="text"
        skill={{
          value: 'skill',
          title: 'skill_title',
          toolTip: { title: 'close' },
          closable: {
            closeIcon: 'skill关闭',
            onClose: mockClose,
          },
        }}
      />,
    );
    expect(getByText('skill_title')).toBeInTheDocument();
    expect(getByText('skill关闭')).toBeInTheDocument();
    const clearButton = getByText('skill关闭');
    fireEvent.click(clearButton);
    expect(mockClose).toHaveBeenCalled();
  });
  it('should render skill no closable', () => {
    const { getByText } = render(
      <Sender
        key="text"
        skill={{
          value: 'skill',
          title: 'skill_title',
          closable: false,
        }}
      />,
    );
    expect(getByText('skill_title')).toBeInTheDocument();
  });
  it('should render skill default closable', () => {
    const { getByText } = render(
      <Sender
        key="text"
        skill={{
          value: 'skill',
          title: 'skill_title',
          closable: true,
        }}
      />,
    );
    expect(getByText('skill_title')).toBeInTheDocument();
  });
  it('should render skill closable disabled', () => {
    const mockClose = jest.fn();
    const { getByText } = render(
      <Sender
        key="text"
        skill={{
          value: 'skill',
          title: 'skill_title',
          closable: {
            closeIcon: 'skill关闭',
            disabled: true,
            onClose: mockClose,
          },
        }}
      />,
    );
    expect(getByText('skill关闭')).toBeInTheDocument();
    const clearButton = getByText('skill关闭');
    // check custom onClick
    fireEvent.click(clearButton);
    expect(mockClose).not.toHaveBeenCalled();
  });

  it('should handle edge cases in getInsertPosition', () => {
    const ref = React.createRef<any>();
    render(<Sender key="text" slotConfig={[{ type: 'text', value: 'Test' }]} ref={ref} />);

    // Test insert with no selection
    Object.defineProperty(window, 'getSelection', {
      value: () => null,
      writable: true,
    });

    ref.current?.insert([{ type: 'text', value: 'insert' }]);

    // Restore getSelection
    Object.defineProperty(window, 'getSelection', {
      value: () => ({
        rangeCount: 0,
        getRangeAt: () => null,
      }),
      writable: true,
    });
  });

  it('should handle empty slotConfig and missing keys', () => {
    const { container } = render(
      <Sender
        key="text"
        slotConfig={[
          { type: 'input' } as any, // Missing key
          { type: 'tag' }, // Missing props
          { type: 'custom' } as any, // Missing customRender
        ]}
      />,
    );

    const inputArea = container.querySelector('[role="textbox"]');
    expect(inputArea).toBeInTheDocument();
  });

  it('should handle onPaste with files', () => {
    const mockPasteFile = jest.fn();
    const { container } = render(
      <Sender key="text" slotConfig={slotConfig} onPasteFile={mockPasteFile} />,
    );

    const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

    // Test paste with files
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.paste(inputArea, {
      clipboardData: {
        getData: () => '',
        files: [mockFile],
      },
    });

    expect(mockPasteFile).toHaveBeenCalledWith([mockFile]);
  });

  it('should handle keyboard events with modifiers', () => {
    const mockSubmit = jest.fn();
    const { container } = render(
      <Sender key="text" slotConfig={slotConfig} onSubmit={mockSubmit} submitType="enter" />,
    );

    const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

    // Test Enter with Ctrl modifier
    fireEvent.keyDown(inputArea, { key: 'Enter', ctrlKey: true });
    expect(mockSubmit).not.toHaveBeenCalled();

    // Test Enter with Alt modifier
    fireEvent.keyDown(inputArea, { key: 'Enter', altKey: true });
    expect(mockSubmit).not.toHaveBeenCalled();

    // Test Enter with Meta modifier
    fireEvent.keyDown(inputArea, { key: 'Enter', metaKey: true });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should handle shift+Enter with submitType="shiftEnter"', () => {
    const mockSubmit = jest.fn();
    const { container } = render(
      <Sender key="text" slotConfig={slotConfig} onSubmit={mockSubmit} submitType="shiftEnter" />,
    );

    const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;
    fireEvent.keyDown(inputArea, { key: 'Enter', shiftKey: true });
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('should handle complex slot interactions', () => {
    const ref = React.createRef<any>();
    const complexConfig: SlotConfigType[] = [
      { type: 'text', value: 'Start' },
      { type: 'input', key: 'input1', props: { placeholder: 'Input 1' } },
      { type: 'select', key: 'select1', props: { options: ['A', 'B'] } },
      { type: 'text', value: 'End' },
    ];

    render(<Sender key="text" slotConfig={complexConfig} ref={ref} />);

    const value = ref.current?.getValue();
    expect(value).toBeDefined();
    expect(Array.isArray(value?.slotConfig)).toBe(true);
  });

  it('should handle slotFocus with edge cases', () => {
    const ref = React.createRef<any>();
    render(
      <Sender
        key="text"
        slotConfig={[
          {
            type: 'content',
            key: 'content-test',
            props: { placeholder: 'Test content' },
          },
        ]}
        ref={ref}
      />,
    );

    // Test slotFocus with no editor
    ref.current?.focus({ cursor: 'slot', key: 'content-test' });

    // Test slotFocus with non-existent key
    ref.current?.focus({ cursor: 'slot', key: 'nonexistent' });
  });

  it('should handle getInsertPosition edge cases', () => {
    const ref = React.createRef<any>();
    render(<Sender key="text" slotConfig={[{ type: 'text', value: 'Test' }]} ref={ref} />);

    // Test insert with cursor position when no selection available
    const originalGetSelection = window.getSelection;
    delete (window as any).getSelection;

    ref.current?.insert([{ type: 'text', value: 'insert' }]);

    // Restore getSelection
    window.getSelection = originalGetSelection;
  });

  it('should handle initClear and clear methods', () => {
    const ref = React.createRef<any>();
    const { container } = render(
      <Sender
        key="text"
        slotConfig={[
          {
            type: 'input',
            key: 'test-input',
            props: { placeholder: 'Test input' },
          },
        ]}
        ref={ref}
      />,
    );

    // Test clear method
    ref.current?.clear();

    // Test clear with no editableRef
    const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;
    expect(inputArea).toBeInTheDocument();
  });

  it('should handle onInternalBlur with keyLock', () => {
    const mockBlur = jest.fn();
    const { container } = render(
      <Sender key="text" slotConfig={[{ type: 'text', value: 'Test' }]} onBlur={mockBlur} />,
    );

    const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

    // Test blur with key lock
    fireEvent.blur(inputArea);
    expect(mockBlur).toHaveBeenCalled();
  });

  it('should handle onInternalKeyUp with Enter key', () => {
    const mockKeyUp = jest.fn();
    const { container } = render(
      <Sender key="text" slotConfig={[{ type: 'text', value: 'Test' }]} onKeyUp={mockKeyUp} />,
    );

    const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;

    // Test key up with Enter
    fireEvent.keyUp(inputArea, { key: 'Enter' });
    expect(mockKeyUp).toHaveBeenCalled();
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

  it('should handle buildEditSlotSpan and buildSpan', () => {
    const ref = React.createRef<any>();
    render(
      <Sender
        key="text"
        slotConfig={[
          {
            type: 'content',
            key: 'content-test',
            props: { placeholder: 'Test content', defaultValue: 'Default' },
          },
        ]}
        ref={ref}
      />,
    );

    // Test content type slot
    const value = ref.current?.getValue();
    expect(value).toBeDefined();
  });

  it('should handle getNodeTextValue with different node types', () => {
    const ref = React.createRef<any>();
    render(
      <Sender
        key="text"
        slotConfig={[
          { type: 'text', value: 'Text 1' },
          {
            type: 'input',
            key: 'input1',
            props: { placeholder: 'Input 1', defaultValue: 'Value 1' },
          },
          { type: 'text', value: 'Text 2' },
        ]}
        ref={ref}
      />,
    );

    const value = ref.current?.getValue();
    expect(value?.value).toContain('Text 1');
    expect(value?.value).toContain('Value 1');
    expect(value?.value).toContain('Text 2');
  });
});
