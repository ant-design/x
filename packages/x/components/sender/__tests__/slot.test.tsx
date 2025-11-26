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

  it('should render skill', () => {
    const mockClose = jest.fn();
    const { getByText } = render(
      <Sender
        key="text"
        skill={{
          value: 'skill',
          title: 'skill_title',
          closable: {
            closeIcon: 'skill关闭',
            onClose: mockClose,
          },
        }}
      />,
    );
    expect(getByText('skill_title')).toBeInTheDocument();
    expect(getByText('skill关闭')).toBeInTheDocument();
  });

  it('should handle input slot interaction', () => {
    const { getByPlaceholderText } = render(<Sender key="text" slotConfig={slotConfig} />);
    const input = getByPlaceholderText('Please enter input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New input value' } });
    expect(input.value).toBe('New input value');
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
});
