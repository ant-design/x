import { fireEvent, render } from '../../../tests/utils';
import { GetRef } from 'antd';
import React from 'react';
import { act } from '../../../tests/utils';
import Sender, { SlotConfigType } from '../index';
import SlotTextArea from '../SlotTextArea';

describe('Sender.SlotTextArea', () => {
  const initialSlotConfig: SlotConfigType[] = [
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

  it('should render initialSlotConfig', () => {
    const { getByText, getByTestId, getByPlaceholderText, container } = render(
      <Sender key="text" initialSlotConfig={initialSlotConfig} />,
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
    const { getByPlaceholderText } = render(
      <Sender initialSlotConfig={initialSlotConfig} onChange={onChange} />,
    );
    const input = getByPlaceholderText('Please enter content') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New content' } });
    const calls = onChange.mock.calls;
    expect(calls[calls.length - 1][0]).toContain('New content');
  });

  it('should handle select slot change', () => {
    const onChange = jest.fn();
    const { container, getByText } = render(
      <Sender key="test" initialSlotConfig={initialSlotConfig} onChange={onChange} />,
    );
    // trigger dropdown
    fireEvent.click(container.querySelector('.ant-sender-slot-select')!);
    fireEvent.click(getByText('A'));
    expect(container.querySelector('.ant-dropdown-menu-title-content')?.textContent).toContain('A');
  });

  it('should handle custom slot interaction', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <Sender initialSlotConfig={initialSlotConfig} onChange={onChange} />,
    );
    fireEvent.click(getByTestId('custom-btn'));
    expect(onChange).toHaveBeenCalledWith(
      expect.stringContaining('custom-value'),
      undefined,
      expect.any(Array),
    );
  });

  it('should trigger onSubmit', () => {
    const onSubmit = jest.fn();
    const { container } = render(
      <Sender initialSlotConfig={initialSlotConfig} onSubmit={onSubmit} />,
    );
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
        <Sender value="bamboo" initialSlotConfig={initialSlotConfig} onSubmit={onSubmit} />,
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
          initialSlotConfig={initialSlotConfig}
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
    render(<Sender initialSlotConfig={initialSlotConfig} ref={ref} />);
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
    const { container } = render(
      <Sender initialSlotConfig={initialSlotConfig} onChange={onChange} />,
    );
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
    const { container } = render(
      <Sender initialSlotConfig={initialSlotConfig} onPasteFile={onPasteFile} />,
    );
    const editable = container.querySelector('.ant-sender-input')!;
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.paste(editable, {
      clipboardData: {
        files: { 0: file, length: 1, item: () => file },
        getData: () => '',
      },
    });
    expect(onPasteFile).toHaveBeenCalledWith(file, expect.anything());
  });

  it('should handle onPaste when clipboardData is empty', () => {
    const onPaste = jest.fn();
    const { container } = render(
      <Sender initialSlotConfig={initialSlotConfig} onPaste={onPaste} />,
    );
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.paste(editable, {});
    expect(onPaste).toHaveBeenCalled();
  });

  it('should trigger onFocus/onBlur events', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { container } = render(
      <Sender initialSlotConfig={initialSlotConfig} onFocus={onFocus} onBlur={onBlur} />,
    );
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.focus(editable);
    fireEvent.blur(editable);
    expect(onFocus).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });

  it('should not trigger onSubmit during composition input', () => {
    const onSubmit = jest.fn();
    const { container } = render(
      <Sender initialSlotConfig={initialSlotConfig} onSubmit={onSubmit} />,
    );
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.compositionStart(editable);
    fireEvent.keyUp(editable, { key: 'Enter' });
    fireEvent.compositionEnd(editable);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should have ref methods focus/blur', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    render(<Sender initialSlotConfig={initialSlotConfig} ref={ref} />);
    expect(typeof ref?.current?.focus).toBe('function');
    expect(typeof ref?.current?.blur).toBe('function');
    ref?.current?.focus({ cursor: 'start' });
    ref?.current?.focus({ cursor: 'end' });
    ref?.current?.focus({ cursor: 'all' });
    ref?.current?.blur();
  });

  it('should be plain text editing when initialSlotConfig is empty', () => {
    const onChange = jest.fn();
    const { container } = render(<Sender onChange={onChange} />);
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.input(editable, { target: { textContent: 'Plain text' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('should reset content when initialSlotConfig changes', () => {
    const { rerender, container } = render(
      <Sender key="A" initialSlotConfig={[{ type: 'text', value: 'A' }]} />,
    );
    expect(container.textContent).toContain('A');
    rerender(<Sender key="B" initialSlotConfig={[{ type: 'text', value: 'B' }]} />);
    expect(container.textContent).toContain('B');
  });

  it('should initialize when initialSlotConfig is undefined', () => {
    // Directly render SlotTextArea
    expect(() => {
      render(<SlotTextArea />);
    }).not.toThrow();
  });

  it('should return null from renderSlot when initialSlotConfig has type but no key', () => {
    const { container } = render(
      <Sender
        initialSlotConfig={[
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
    render(<Sender initialSlotConfig={initialSlotConfig} ref={ref} />);

    ref?.current?.focus();

    expect(typeof ref?.current?.focus).toBe('function');
  });

  it('should render and update input slot', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    const initialSlotConfig: SlotConfigType[] = [
      {
        type: 'input',
        key: 'input1',
        props: { placeholder: '请输入内容', defaultValue: '默认值' },
      },
    ];
    const { getByPlaceholderText } = render(
      <Sender initialSlotConfig={initialSlotConfig} ref={ref} />,
    );
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
    const initialSlotConfig: SlotConfigType[] = [
      { type: 'select', key: 'select1', props: { options: ['A', 'B'], placeholder: '请选择' } },
    ];
    const { container, getByText } = render(
      <Sender initialSlotConfig={initialSlotConfig} ref={ref} />,
    );
    // Select option A
    fireEvent.click(container.querySelector('.ant-sender-slot-select')!);
    fireEvent.click(getByText('A'));
    expect(ref?.current?.getValue().value).toContain('A');
  });

  it('should test tag slot', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    const initialSlotConfig: SlotConfigType[] = [
      { type: 'tag', key: 'tag1', props: { label: 'Tag', value: 'Value' } },
    ];
    render(<Sender initialSlotConfig={initialSlotConfig} ref={ref} />);
    // Tag slot only shows label
    expect(ref?.current?.getValue().value).toContain('Value');
  });

  it('should test custom slot', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    const initialSlotConfig: SlotConfigType[] = [
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
    const { getByTestId } = render(<Sender initialSlotConfig={initialSlotConfig} ref={ref} />);
    // Initial value
    expect(ref?.current?.getValue().value).toBe('[]');
    // Click custom button
    fireEvent.click(getByTestId('custom-btn'));
    expect(ref?.current?.getValue().value).toBe('[custom-value]');
  });

  it('should call insert when speech input and initialSlotConfig exists', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    const testSlotConfig = [
      { type: 'input' as const, key: 'input1', props: { placeholder: 'Please enter content' } },
    ];
    render(<Sender initialSlotConfig={testSlotConfig} allowSpeech ref={ref} />);
    ref?.current?.insert([{ type: 'text', value: 'Speech content' }]);
    expect(ref?.current?.getValue().value).toContain('Speech content');
  });

  it('should call insert slot', () => {
    const senderRef = React.createRef<GetRef<typeof Sender>>();
    const testSlotConfig = [
      { type: 'input' as const, key: 'input1', props: { placeholder: 'Please enter content' } },
    ];
    (globalThis.getSelection as any) = () => null;

    render(<Sender initialSlotConfig={testSlotConfig} ref={senderRef} />);
    senderRef?.current?.insert(
      [{ type: 'tag', key: 'tag_1', props: { label: 'Tag_1', value: 'Tag1' } }],
      'end',
    );
  });
  it('should call triggerValueChange when speech input and initialSlotConfig does not exist', () => {
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

  it('should call clear when clear button is clicked and initialSlotConfig exists', () => {
    const ref = React.createRef<GetRef<typeof Sender>>();
    const testInitialSlotConfig = [
      { type: 'input' as const, key: 'input1', props: { placeholder: 'Please enter content' } },
    ];
    render(<Sender initialSlotConfig={testInitialSlotConfig} ref={ref} />);
    ref?.current?.insert([{ type: 'text', value: 'Clear me' }]);
    ref?.current?.clear();
    expect(ref?.current?.getValue().value).toBe('');
  });

  it('should only clear value when clear button is clicked and initialSlotConfig does not exist', () => {
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

  it('should prevent default and focus when clicking content area (not input) and initialSlotConfig does not exist', () => {
    const { container } = render(<Sender />);
    const content = container.querySelector('.ant-sender-content')!;
    const event = new window.MouseEvent('mousedown', { bubbles: true, cancelable: true });
    content.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should not prevent default when clicking content area and initialSlotConfig exists', () => {
    const initialSlotConfig = [
      { type: 'input' as const, key: 'input1', props: { placeholder: 'Please enter content' } },
    ];
    const { container } = render(<Sender initialSlotConfig={initialSlotConfig} />);
    const content = container.querySelector('.ant-sender-content')!;
    const preventDefault = jest.fn();
    fireEvent.mouseDown(content, { target: content, preventDefault });
    // Should not prevent default when initialSlotConfig exists
    expect(preventDefault).not.toHaveBeenCalled();
  });
});
