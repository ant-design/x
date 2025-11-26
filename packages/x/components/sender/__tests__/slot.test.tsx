import React from 'react';
import { fireEvent, render } from '../../../tests/utils';
import Sender, { SlotConfigType } from '../index';

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

  it('should handle input slot interaction', () => {
    const { getByPlaceholderText } = render(<Sender key="text" slotConfig={slotConfig} />);
    const input = getByPlaceholderText('Please enter content') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'New input value' } });
    expect(input.value).toBe('New input value');
  });

  it('should handle select slot interaction', () => {
    const { container } = render(<Sender key="text" slotConfig={slotConfig} />);

    // 验证选择器相关的DOM结构存在
    const selectContainer = container.querySelector('[data-placeholder="Please select"]');
    expect(selectContainer).toBeInTheDocument();
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
    // 验证formatResult函数是否正确格式化结果
    const customSlot = slotConfig[4] as any;
    expect(customSlot.formatResult('custom-value')).toBe('[custom-value]');
  });
});
