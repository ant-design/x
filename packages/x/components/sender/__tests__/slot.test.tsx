import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { act } from '../../../tests/utils';
import SlotTextArea from '../SlotTextArea';
import Sender, { SlotNode } from '../index';

describe('Sender.SlotTextArea', () => {
  const slotConfig: SlotNode[] = [
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

  it('渲染 slotConfig', () => {
    const { container, getByPlaceholderText, getByText, getByTestId } = render(
      <Sender slotConfig={slotConfig} />,
    );
    expect(container.textContent).toContain('前缀文本');
    expect(getByPlaceholderText('请输入内容')).toBeInTheDocument();
    expect(getByText('请选择')).toBeInTheDocument();
    expect(getByText('标签')).toBeInTheDocument();
    expect(getByTestId('custom-btn')).toBeInTheDocument();
  });

  it('input slot 输入', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(<Sender slotConfig={slotConfig} onChange={onChange} />);
    const input = getByPlaceholderText('请输入内容') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '新内容' } });
    const calls = onChange.mock.calls;
    expect(calls[calls.length - 1][0]).toContain('新内容');
  });

  it('select slot 选择', () => {
    const onChange = jest.fn();
    const { container, getByText } = render(<Sender slotConfig={slotConfig} onChange={onChange} />);
    // 触发下拉
    fireEvent.click(container.querySelector('.ant-sender-slot-select-selector-value')!);
    fireEvent.click(getByText('A'));
    expect(onChange).toHaveBeenCalledWith(
      expect.stringContaining('A'),
      undefined,
      expect.any(Array),
    );
  });

  it('custom slot 交互', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<Sender slotConfig={slotConfig} onChange={onChange} />);
    fireEvent.click(getByTestId('custom-btn'));
    expect(onChange).toHaveBeenCalledWith(
      expect.stringContaining('custom-value'),
      undefined,
      expect.any(Array),
    );
  });

  it('onSubmit 触发', () => {
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

  it('ref 方法 getValue/insert/clear', () => {
    const ref = React.createRef<any>();
    render(<Sender slotConfig={slotConfig} ref={ref} />);
    // insert
    ref.current.insert('插入文本');
    expect(ref.current.getValue().value).toContain('插入文本');
    // clear
    ref.current.clear();
    expect(ref.current.getValue().value).toBe('');
  });

  it('onPaste 粘贴文本', () => {
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

  it('onPaste 粘贴文件', () => {
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

  it('onPaste clipboardData 为空', () => {
    const onPaste = jest.fn();
    const { container } = render(<Sender slotConfig={slotConfig} onPaste={onPaste} />);
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.paste(editable, {});
    expect(onPaste).toHaveBeenCalled();
  });

  it('onFocus/onBlur 事件', () => {
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

  it('组合输入事件不触发提交', () => {
    const onSubmit = jest.fn();
    const { container } = render(<Sender slotConfig={slotConfig} onSubmit={onSubmit} />);
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.compositionStart(editable);
    fireEvent.keyUp(editable, { key: 'Enter' });
    fireEvent.compositionEnd(editable);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('ref focus/blur 方法', () => {
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

  it('slotConfig 为空时为纯文本编辑', () => {
    const onChange = jest.fn();
    const { container } = render(<Sender onChange={onChange} />);
    const editable = container.querySelector('.ant-sender-input')!;
    fireEvent.input(editable, { target: { textContent: '纯文本' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('slotConfig 变化时内容重置', () => {
    const { rerender, container } = render(<Sender slotConfig={[{ type: 'text', text: 'A' }]} />);
    expect(container.textContent).toContain('A');
    rerender(<Sender slotConfig={[{ type: 'text', text: 'B' }]} />);
    expect(container.textContent).toContain('B');
  });

  it('slotConfig 为 undefined 时初始化', () => {
    // 直接渲染 SlotTextArea
    expect(() => {
      render(<SlotTextArea />);
    }).not.toThrow();
  });

  it('slotConfig 有 type 但无 key 时 renderSlot 返回 null', () => {
    const { container } = render(
      <Sender
        slotConfig={[
          { type: 'input', props: { defaultValue: '默认值', placeholder: '请输入内容' } },
        ]}
      />,
    );
    // 不显示任何内容
    expect(container.textContent).toBe('');
  });

  it('ref focus() 不传参数时 editor?.focus() 分支', () => {
    const ref = React.createRef<any>();
    render(<Sender slotConfig={slotConfig} ref={ref} />);
    // 只调用不传参数
    ref.current.focus();
    // 能正常调用即可
    expect(typeof ref.current.focus).toBe('function');
  });

  it('测试 input slot', () => {
    const ref = React.createRef<any>();
    const slotConfig: SlotNode[] = [
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

  it('测试 select slot', () => {
    const ref = React.createRef<any>();
    const slotConfig: SlotNode[] = [
      { type: 'select', key: 'select1', props: { options: ['A', 'B'], placeholder: '请选择' } },
    ];
    const { container, getByText } = render(<Sender slotConfig={slotConfig} ref={ref} />);
    // 选择 A
    fireEvent.click(container.querySelector('.ant-sender-slot-select-selector-value')!);
    fireEvent.click(getByText('A'));
    expect(ref.current.getValue().value).toContain('A');
  });

  it('测试 tag slot', () => {
    const ref = React.createRef<any>();
    const slotConfig: SlotNode[] = [
      { type: 'tag', key: 'tag1', props: { label: '标签', value: '值' } },
    ];
    render(<Sender slotConfig={slotConfig} ref={ref} />);
    // tag slot 只显示 label
    expect(ref.current.getValue().value).toContain('值');
  });

  it('测试 custom slot', () => {
    const ref = React.createRef<any>();
    const slotConfig: SlotNode[] = [
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

  it('语音输入 slotConfig 存在时 insert 被调用', () => {
    const ref = React.createRef<any>();
    const slotConfig = [
      { type: 'input' as const, key: 'input1', props: { placeholder: '请输入内容' } },
    ];
    render(<Sender slotConfig={slotConfig} allowSpeech ref={ref} />);
    ref.current.insert('语音内容');
    expect(ref.current.getValue().value).toContain('语音内容');
  });

  it('语音输入 slotConfig 不存在时 triggerValueChange 被调用', () => {
    const onChange = jest.fn();
    const { container } = render(<Sender allowSpeech onChange={onChange} />);
    const textarea = container.querySelector('textarea')!;
    fireEvent.change(textarea, { target: { value: '语音内容' } });
    const call = onChange.mock.calls[0];
    expect(call[0]).toBe('语音内容');
  });

  it('loading=true 时点击发送按钮不会触发 onSubmit', () => {
    const onSubmit = jest.fn();
    const { container } = render(<Sender loading value="test" onSubmit={onSubmit} />);
    fireEvent.click(container.querySelector('button')!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('value 为空时点击发送按钮不会触发 onSubmit', () => {
    const onSubmit = jest.fn();
    const { container } = render(<Sender value="" onSubmit={onSubmit} />);
    fireEvent.click(container.querySelector('button')!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('slotConfig 存在时点击清除按钮会调用 clear', () => {
    const ref = React.createRef<any>();
    const slotConfig = [
      { type: 'input' as const, key: 'input1', props: { placeholder: '请输入内容' } },
    ];
    render(<Sender slotConfig={slotConfig} ref={ref} />);
    ref.current.insert('内容');
    ref.current.clear();
    expect(ref.current.getValue().value).toBe('');
  });

  it('slotConfig 不存在时点击清除按钮只清空 value', () => {
    const ref = React.createRef<any>();
    render(<Sender ref={ref} />);
    ref.current.insert('内容');
    ref.current.clear();
    expect(ref.current.getValue().value).toBe('');
  });

  it('allowSpeech 渲染语音按钮', () => {
    const { container } = render(<Sender allowSpeech />);
    expect(container.querySelector('.anticon-audio-muted,.anticon-audio')).toBeTruthy();
  });

  it('loading 渲染 LoadingButton', () => {
    const { container } = render(<Sender loading />);
    // 断言存在 loading icon
    expect(container.querySelector('[class*="loading-icon"]')).toBeTruthy();
  });

  it('loading=false 渲染 SendButton', () => {
    const { container } = render(<Sender loading={false} />);
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('actions 为函数时自定义渲染', () => {
    const { getByText } = render(<Sender actions={() => <div>自定义按钮</div>} />);
    expect(getByText('自定义按钮')).toBeInTheDocument();
  });

  it('actions 为 ReactNode 时渲染', () => {
    const { getByText } = render(<Sender actions={<div>节点按钮</div>} />);
    expect(getByText('节点按钮')).toBeInTheDocument();
  });

  it('actions 为 false 时不渲染', () => {
    const { container } = render(<Sender actions={false} />);
    expect(container.querySelector('.ant-sender-actions-list')).toBeNull();
  });

  it('slotConfig 不存在时点击内容区非输入框阻止默认并 focus', () => {
    const { container } = render(<Sender />);
    const content = container.querySelector('.ant-sender-content')!;
    const event = new window.MouseEvent('mousedown', { bubbles: true, cancelable: true });
    content.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('slotConfig 存在时点击内容区不阻止默认', () => {
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
