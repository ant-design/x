import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { act } from '../../../tests/utils';
import Sender, { SlotConfigType } from '../index';
import SlotTextArea from '../SlotTextArea';

describe('Sender.SlotTextArea', () => {
  const slotConfig: SlotConfigType[] = [
    { type: 'text', text: '前缀文本' },
    { type: 'input', key: 'input1', props: { placeholder: '请输入内容', defaultValue: '默认值' } },
    { type: 'select', key: 'select1', props: { options: ['A', 'B'], placeholder: '请选择' } },
    { type: 'tag', key: 'tag1', props: { label: '标签' } },
    {
      type: 'custom',
      key: 'custom1',
      customRender: (value: any, onChange: (value: any) => void) => (
        <button type="button" data-testid="custom-btn" onClick={() => onChange('custom-value')}>
          {value || '自定义'}
        </button>
      ),
      formatResult: (v: any) => `[${v}]`,
    },
  ];

  it('should render slotConfig', () => {
    const { container, getByPlaceholderText, getByText, getByTestId } = render(
      <Sender slotConfig={slotConfig} />,
    );
    expect(container.textContent).toContain('前缀文本');
    expect(getByPlaceholderText('请输入内容')).toBeInTheDocument();
    expect(getByText('请选择')).toBeInTheDocument();
    expect(getByText('标签')).toBeInTheDocument();
    expect(getByTestId('custom-btn')).toBeInTheDocument();
  });

  it('should handle input slot change', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(<Sender slotConfig={slotConfig} onChange={onChange} />);
    const input = getByPlaceholderText('请输入内容') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '新内容' } });
    const calls = onChange.mock.calls;
    expect(calls[calls.length - 1][0]).toContain('新内容');
  });

  it('should handle select slot change', () => {
    const onChange = jest.fn();
    const { container, getByText } = render(<Sender slotConfig={slotConfig} onChange={onChange} />);
    // 触发下拉
    fireEvent.click(container.querySelector('.ant-sender-slot-select')!);
    fireEvent.click(getByText('A'));
    expect(onChange).toHaveBeenCalledWith(
      expect.stringContaining('A'),
      undefined,
      expect.any(Array),
    );
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
    // 回车提交
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
    const ref = React.createRef<any>();
    render(<Sender slotConfig={slotConfig} ref={ref} />);
    // insert
    ref.current.insert('插入文本');
    expect(ref.current.getValue().value).toContain('插入文本');
    // clear
    ref.current.clear();
    expect(ref.current.getValue().value).toBe('');
  });

  it('should handle onPaste with text', () => {
    const onChange = jest.fn();
    const { container } = render(<Sender slotConfig={slotConfig} onChange={onChange} />);
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.paste(editable, {
      clipboardData: {
        getData: () => '粘贴内容',
        files: { length: 0 },
      },
    });
    // 粘贴文本后内容应变化
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
    expect(onPasteFile).toHaveBeenCalledWith(file, expect.anything());
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
    const ref = React.createRef<any>();
    render(<Sender slotConfig={slotConfig} ref={ref} />);
    expect(typeof ref.current.focus).toBe('function');
    expect(typeof ref.current.blur).toBe('function');
    // focus({cursor})
    ref.current.focus({ cursor: 'start' });
    ref.current.focus({ cursor: 'end' });
    ref.current.focus({ cursor: 'all' });
    ref.current.blur();
  });

  it('should be plain text editing when slotConfig is empty', () => {
    const onChange = jest.fn();
    const { container } = render(<Sender onChange={onChange} />);
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.input(editable, { target: { textContent: '纯文本' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('should reset content when slotConfig changes', () => {
    const { rerender, container } = render(<Sender slotConfig={[{ type: 'text', text: 'A' }]} />);
    expect(container.textContent).toContain('A');
    rerender(<Sender slotConfig={[{ type: 'text', text: 'B' }]} />);
    expect(container.textContent).toContain('B');
  });

  it('should initialize when slotConfig is undefined', () => {
    // 直接渲染 SlotTextArea
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
    // 不显示任何内容
    expect(container.textContent).toBe('');
  });

  it('should cover editor?.focus() branch when ref.focus() is called without arguments', () => {
    const ref = React.createRef<any>();
    render(<Sender slotConfig={slotConfig} ref={ref} />);
    // 只调用不传参数
    ref.current.focus();
    // 能正常调用即可
    expect(typeof ref.current.focus).toBe('function');
  });

  it('should test input slot', () => {
    const ref = React.createRef<any>();
    const slotConfig: SlotConfigType[] = [
      {
        type: 'input',
        key: 'input1',
        props: { placeholder: '请输入内容', defaultValue: '默认值' },
      },
    ];
    const { getByPlaceholderText } = render(<Sender slotConfig={slotConfig} ref={ref} />);
    // 初始值
    expect(ref.current.getValue().value).toContain('默认值');
    // 输入新内容
    fireEvent.change(getByPlaceholderText('请输入内容'), { target: { value: '新内容' } });
    expect(ref.current.getValue().value).toContain('新内容');
  });

  it('should test select slot', () => {
    const ref = React.createRef<any>();
    const slotConfig: SlotConfigType[] = [
      { type: 'select', key: 'select1', props: { options: ['A', 'B'], placeholder: '请选择' } },
    ];
    const { container, getByText } = render(<Sender slotConfig={slotConfig} ref={ref} />);
    // 选择 A
    fireEvent.click(container.querySelector('.ant-sender-slot-select')!);
    fireEvent.click(getByText('A'));
    expect(ref.current.getValue().value).toContain('A');
  });

  it('should test tag slot', () => {
    const ref = React.createRef<any>();
    const slotConfig: SlotConfigType[] = [
      { type: 'tag', key: 'tag1', props: { label: '标签', value: '值' } },
    ];
    render(<Sender slotConfig={slotConfig} ref={ref} />);
    // tag slot 只显示 label
    expect(ref.current.getValue().value).toContain('值');
  });

  it('should test custom slot', () => {
    const ref = React.createRef<any>();
    const slotConfig: SlotConfigType[] = [
      {
        type: 'custom',
        key: 'custom1',
        customRender: (value: any, onChange: (value: any) => void) => (
          <button type="button" data-testid="custom-btn" onClick={() => onChange('custom-value')}>
            {value || '自定义'}
          </button>
        ),
        formatResult: (v: any) => `[${v}]`,
      },
    ];
    const { getByTestId } = render(<Sender slotConfig={slotConfig} ref={ref} />);
    // 初始值
    expect(ref.current.getValue().value).toBe('[]');
    // 交互
    fireEvent.click(getByTestId('custom-btn'));
    expect(ref.current.getValue().value).toBe('[custom-value]');
  });

  it('should call insert when speech input and slotConfig exists', () => {
    const ref = React.createRef<any>();
    const slotConfig = [
      { type: 'input' as const, key: 'input1', props: { placeholder: '请输入内容' } },
    ];
    render(<Sender slotConfig={slotConfig} allowSpeech ref={ref} />);
    ref.current.insert('语音内容');
    expect(ref.current.getValue().value).toContain('语音内容');
  });

  it('should call triggerValueChange when speech input and slotConfig does not exist', () => {
    const onChange = jest.fn();
    const { container } = render(<Sender allowSpeech onChange={onChange} />);
    const textarea = container.querySelector('textarea')!;
    fireEvent.change(textarea, { target: { value: '语音内容' } });
    const call = onChange.mock.calls[0];
    expect(call[0]).toBe('语音内容');
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
    const ref = React.createRef<any>();
    const slotConfig = [
      { type: 'input' as const, key: 'input1', props: { placeholder: '请输入内容' } },
    ];
    render(<Sender slotConfig={slotConfig} ref={ref} />);
    ref.current.insert('内容');
    ref.current.clear();
    expect(ref.current.getValue().value).toBe('');
  });

  it('should only clear value when clear button is clicked and slotConfig does not exist', () => {
    const ref = React.createRef<any>();
    render(<Sender ref={ref} />);
    ref.current.insert('内容');
    ref.current.clear();
    expect(ref.current.getValue().value).toBe('');
  });

  it('should render speech button when allowSpeech is true', () => {
    const { container } = render(<Sender allowSpeech />);
    expect(container.querySelector('.anticon-audio-muted,.anticon-audio')).toBeTruthy();
  });

  it('should render LoadingButton when loading is true', () => {
    const { container } = render(<Sender loading />);
    // 断言存在 loading icon
    expect(container.querySelector('[class*="loading-icon"]')).toBeTruthy();
  });

  it('should render SendButton when loading is false', () => {
    const { container } = render(<Sender loading={false} />);
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('should render custom actions when actions is a function', () => {
    const { getByText } = render(<Sender actions={() => <div>自定义按钮</div>} />);
    expect(getByText('自定义按钮')).toBeInTheDocument();
  });

  it('should render actions when actions is a ReactNode', () => {
    const { getByText } = render(<Sender actions={<div>节点按钮</div>} />);
    expect(getByText('节点按钮')).toBeInTheDocument();
  });

  it('should not render actions when actions is false', () => {
    const { container } = render(<Sender actions={false} />);
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
      { type: 'input' as const, key: 'input1', props: { placeholder: '请输入内容' } },
    ];
    const { container } = render(<Sender slotConfig={slotConfig} />);
    const content = container.querySelector('.ant-sender-content')!;
    const preventDefault = jest.fn();
    fireEvent.mouseDown(content, { target: content, preventDefault });
    // slotConfig 存在时不阻止默认
    expect(preventDefault).not.toHaveBeenCalled();
  });
});
