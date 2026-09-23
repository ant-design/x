import React from 'react';
import { fireEvent, render } from '../../../tests/utils';
import Choice from '..';
import type { ChoiceItemType } from '../interface';

const mockItems: ChoiceItemType[] = [
  { key: '1', label: 'A' },
  { key: '2', label: 'B' },
  { key: '3', label: 'C', disabled: true },
];

describe('Choice select behavior', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // ======================== Single Mode ========================
  it('single mode: select an item', () => {
    const { getByText, container } = render(<Choice items={mockItems} />);
    fireEvent.click(getByText('A'));
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(1);
  });

  it('single mode: deselect by clicking again', () => {
    const { getByText, container } = render(<Choice items={mockItems} />);
    fireEvent.click(getByText('A'));
    expect(container.querySelector('.ant-choice-item-selected')).toBeTruthy();
    fireEvent.click(getByText('A'));
    expect(container.querySelector('.ant-choice-item-selected')).toBeFalsy();
  });

  it('single mode: selecting one replaces previous selection', () => {
    const { getByText, container } = render(<Choice items={mockItems} />);
    fireEvent.click(getByText('A'));
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(1);

    fireEvent.click(getByText('B'));
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(1);
  });

  it('single mode: onChange called with single value', () => {
    const onChange = jest.fn();
    const { getByText } = render(<Choice items={mockItems} onChange={onChange} />);
    fireEvent.click(getByText('A'));
    expect(onChange).toHaveBeenCalledWith('1', expect.objectContaining({ type: 'select' }));
  });

  it('single mode: onChange called with deselect', () => {
    const onChange = jest.fn();
    const { getByText } = render(<Choice items={mockItems} onChange={onChange} defaultValue="1" />);
    fireEvent.click(getByText('A'));
    expect(onChange).toHaveBeenCalledWith(undefined, expect.objectContaining({ type: 'deselect' }));
  });

  // ======================== Multiple Mode ========================
  it('multiple mode: select multiple items', () => {
    const { getByText, container } = render(<Choice items={mockItems} mode="multiple" />);
    fireEvent.click(getByText('A'));
    fireEvent.click(getByText('B'));
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(2);
  });

  it('multiple mode: deselect an item', () => {
    const { getByText, container } = render(
      <Choice items={mockItems} mode="multiple" defaultValue={['1', '2']} />,
    );
    fireEvent.click(getByText('A'));
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(1);
  });

  it('multiple mode: onChange called with array value', () => {
    const onChange = jest.fn();
    const { getByText } = render(<Choice items={mockItems} mode="multiple" onChange={onChange} />);
    fireEvent.click(getByText('A'));
    expect(onChange).toHaveBeenCalledWith(['1'], expect.objectContaining({ type: 'select' }));
  });

  // ======================== maxCount ========================
  it('multiple mode: maxCount limits selection', () => {
    const { getByText, container } = render(
      <Choice items={mockItems} mode="multiple" maxCount={2} />,
    );
    fireEvent.click(getByText('A'));
    fireEvent.click(getByText('B'));
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(2);
  });

  it('multiple mode: cannot select beyond maxCount', () => {
    const items: ChoiceItemType[] = [
      { key: '1', label: 'A' },
      { key: '2', label: 'B' },
      { key: '3', label: 'C' },
    ];
    const { getByText, container } = render(<Choice items={items} mode="multiple" maxCount={2} />);
    fireEvent.click(getByText('A'));
    fireEvent.click(getByText('B'));
    fireEvent.click(getByText('C'));
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(2);
  });

  // ======================== Disabled ========================
  it('disabled item cannot be selected', () => {
    const { getByText, container } = render(<Choice items={mockItems} />);
    fireEvent.click(getByText('C'));
    expect(container.querySelector('.ant-choice-item-selected')).toBeFalsy();
  });

  it('group disabled prevents all selection', () => {
    const { getByText, container } = render(<Choice items={mockItems} disabled />);
    fireEvent.click(getByText('A'));
    expect(container.querySelector('.ant-choice-item-selected')).toBeFalsy();
  });

  // ======================== Controlled ========================
  it('controlled: value prop controls selection', () => {
    const { container } = render(<Choice items={mockItems} value="2" />);
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(1);
  });

  it('controlled: array value in multiple mode', () => {
    const { container } = render(<Choice items={mockItems} mode="multiple" value={['1', '2']} />);
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(2);
  });

  it('controlled: value change updates selection', () => {
    const { container, rerender } = render(<Choice items={mockItems} value="1" />);
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(1);

    rerender(<Choice items={mockItems} value="2" />);
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(1);
    expect(
      container.querySelector('.ant-choice-item-selected .ant-choice-item-label')?.textContent,
    ).toBe('B');
  });

  // ======================== Nested ========================
  it('nested children render correctly', () => {
    const items: ChoiceItemType[] = [
      {
        key: 'parent',
        label: 'Parent',
        children: [
          { key: 'child1', label: 'Child 1' },
          { key: 'child2', label: 'Child 2' },
        ],
      },
    ];
    const { getByText, container } = render(<Choice items={items} />);
    expect(getByText('Parent')).toBeInTheDocument();
    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
    expect(container.querySelector('.ant-choice-nested')).toBeTruthy();
  });

  // ======================== ChangeInfo ========================
  it('ChangeInfo contains correct changedItems', () => {
    const onChange = jest.fn();
    const { getByText } = render(<Choice items={mockItems} onChange={onChange} />);
    fireEvent.click(getByText('A'));
    expect(onChange).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        changedItems: [mockItems[0]],
        items: mockItems,
      }),
    );
  });

  // ======================== defaultValue ========================
  it('defaultValue with array in multiple mode', () => {
    const { container } = render(
      <Choice items={mockItems} mode="multiple" defaultValue={['1', '2']} />,
    );
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(2);
  });

  it('defaultValue with single value in single mode', () => {
    const { container } = render(<Choice items={mockItems} defaultValue="1" />);
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(1);
  });
});
