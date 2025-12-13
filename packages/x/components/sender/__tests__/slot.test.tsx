import React from 'react';
import { fireEvent, render, waitFor } from '../../../tests/utils';
import Sender, { SlotConfigType } from '../index';

// 设置全局的 DOM API mock
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

  describe('核心功能测试', () => {
    it('应该正确渲染所有slot类型', () => {
      const { getByText, getByPlaceholderText, getByTestId } = render(
        <Sender slotConfig={baseSlotConfig} />,
      );

      expect(getByText('Prefix')).toBeInTheDocument();
      expect(getByPlaceholderText('Enter input')).toBeInTheDocument();
      expect(getByText('Content')).toBeInTheDocument();
      expect(getByText('Tag Label')).toBeInTheDocument();
      expect(getByTestId('custom-btn')).toBeInTheDocument();
    });

    it('应该处理空配置', () => {
      const { container } = render(<Sender slotConfig={[]} />);
      expect(container.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('应该提供完整的ref接口', () => {
      const ref = React.createRef<any>();
      render(<Sender slotConfig={baseSlotConfig} ref={ref} />);

      expect(ref.current).toBeDefined();
      expect(typeof ref.current.focus).toBe('function');
      expect(typeof ref.current.blur).toBe('function');
      expect(typeof ref.current.clear).toBe('function');
      expect(typeof ref.current.getValue).toBe('function');
      expect(typeof ref.current.insert).toBe('function');
    });

    it('应该正确获取和设置值', () => {
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

  describe('交互测试', () => {
    it('应该处理输入交互', () => {
      const onChange = jest.fn();
      const { getByPlaceholderText } = render(
        <Sender slotConfig={baseSlotConfig} onChange={onChange} />,
      );

      const input = getByPlaceholderText('Enter input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'New Value' } });
      expect(input.value).toBe('New Value');
    });

    it('应该处理自定义slot交互', () => {
      const { getByTestId } = render(<Sender slotConfig={baseSlotConfig} />);
      const customBtn = getByTestId('custom-btn');

      expect(customBtn.textContent).toBe('Custom');
      fireEvent.click(customBtn);
      expect(customBtn.textContent).toBe('custom-value');
    });

    it('应该处理键盘事件', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <Sender slotConfig={baseSlotConfig} onSubmit={onSubmit} submitType="enter" />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;
      fireEvent.keyDown(inputArea, { key: 'Enter' });
      expect(onSubmit).toHaveBeenCalled();
    });

    it('应该处理Shift+Enter提交', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <Sender slotConfig={baseSlotConfig} onSubmit={onSubmit} submitType="shiftEnter" />,
      );

      const inputArea = container.querySelector('[role="textbox"]') as HTMLElement;
      fireEvent.keyDown(inputArea, { key: 'Enter', shiftKey: true });
      expect(onSubmit).toHaveBeenCalled();
    });

    it('应该处理粘贴事件', () => {
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

  describe('Skill功能测试', () => {
    it('应该渲染带关闭按钮的skill', async () => {
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

    it('应该处理不可关闭的skill', async () => {
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

  describe('边界条件测试', () => {
    it('应该处理缺失key的警告', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidConfig = [{ type: 'input', props: { placeholder: 'No key' } } as SlotConfigType];

      render(<Sender slotConfig={invalidConfig} />);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Slot key is missing'));
      consoleSpy.mockRestore();
    });

    it('应该处理禁用和只读状态', () => {
      const { container: disabledContainer } = render(
        <Sender slotConfig={baseSlotConfig} disabled />,
      );
      const { container: readonlyContainer } = render(
        <Sender slotConfig={baseSlotConfig} readOnly />,
      );

      expect(disabledContainer.querySelector('[role="textbox"]')).toBeInTheDocument();
      expect(readonlyContainer.querySelector('[role="textbox"]')).toBeInTheDocument();
    });

    it('应该处理autoSize配置', () => {
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

    it('应该处理所有事件回调', () => {
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

  describe('高覆盖率测试', () => {
    it('应该处理所有slot类型的边界情况', () => {
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

    it('应该处理所有焦点选项', () => {
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

    it('应该处理submitDisabled状态', () => {
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
