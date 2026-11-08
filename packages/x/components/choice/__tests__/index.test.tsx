import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render } from '../../../tests/utils';
import Choice from '..';

const mockItems = [
  {
    key: '1',
    label: 'Option 1',
    description: 'Description 1',
    disabled: false,
  },
  {
    key: '2',
    label: 'Option 2',
    description: 'Description 2',
    disabled: false,
  },
  {
    key: '3',
    label: 'Option 3',
    description: 'Description 3',
    disabled: true,
    disabledReason: 'Not available',
  },
];

describe('choice', () => {
  mountTest(() => <Choice items={mockItems} />);
  rtlTest(() => <Choice items={mockItems} />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render the correct number of items', () => {
    const { container } = render(<Choice items={mockItems} />);
    expect(container.querySelectorAll('.ant-choice-item')).toHaveLength(mockItems.length);
  });

  it('should render title and description', () => {
    const { getByText } = render(
      <Choice items={mockItems} title="Test Title" description="Test Description" />,
    );
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
  });

  it('should render labels and descriptions', () => {
    const { getByText } = render(<Choice items={mockItems} />);
    mockItems.forEach((item) => {
      expect(getByText(item.label)).toBeInTheDocument();
      expect(getByText(item.description)).toBeInTheDocument();
    });
  });

  it('should select an item on click in single mode', () => {
    const { getByText, container } = render(<Choice items={mockItems} />);
    fireEvent.click(getByText('Option 1'));
    expect(container.querySelector('.ant-choice-item-selected')).toBeTruthy();
  });

  it('should deselect an item on click in single mode', () => {
    const { getByText, container } = render(<Choice items={mockItems} />);
    fireEvent.click(getByText('Option 1'));
    expect(container.querySelector('.ant-choice-item-selected')).toBeTruthy();
    fireEvent.click(getByText('Option 1'));
    expect(container.querySelector('.ant-choice-item-selected')).toBeFalsy();
  });

  it('should call onChange when selection changes', () => {
    const handleChange = jest.fn();
    const { getByText } = render(<Choice items={mockItems} onChange={handleChange} />);
    fireEvent.click(getByText('Option 1'));
    expect(handleChange).toHaveBeenCalledWith('1', expect.objectContaining({ type: 'select' }));
  });

  it('should call onItemClick when an item is clicked', () => {
    const handleItemClick = jest.fn();
    const { getByText } = render(<Choice items={mockItems} onItemClick={handleItemClick} />);
    fireEvent.click(getByText('Option 1'));
    expect(handleItemClick).toHaveBeenCalledWith({
      data: mockItems[0],
      index: 0,
    });
  });

  it('should not trigger click for disabled items', () => {
    const handleChange = jest.fn();
    const { getByText, container } = render(<Choice items={mockItems} onChange={handleChange} />);
    fireEvent.click(getByText('Option 3'));
    expect(handleChange).not.toHaveBeenCalled();
    expect(container.querySelector('.ant-choice-item-disabled')).toBeTruthy();
  });

  it('should render disabled reason', () => {
    const { getByText } = render(<Choice items={mockItems} />);
    expect(getByText('Not available')).toBeInTheDocument();
  });

  it('should support multiple mode', () => {
    const handleChange = jest.fn();
    const { getByText, container } = render(
      <Choice items={mockItems} mode="multiple" onChange={handleChange} />,
    );
    fireEvent.click(getByText('Option 1'));
    fireEvent.click(getByText('Option 2'));
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(2);
    expect(handleChange).toHaveBeenCalledWith(
      ['1', '2'],
      expect.objectContaining({ type: 'select' }),
    );
  });

  it('should respect maxCount in multiple mode', () => {
    const handleChange = jest.fn();
    const { getByText, container } = render(
      <Choice items={mockItems} mode="multiple" maxCount={1} onChange={handleChange} />,
    );
    fireEvent.click(getByText('Option 1'));
    fireEvent.click(getByText('Option 2'));
    expect(container.querySelectorAll('.ant-choice-item-selected')).toHaveLength(1);
  });

  it('should render different layouts', () => {
    const { container: listContainer } = render(<Choice items={mockItems} layout="list" />);
    expect(listContainer.querySelector('.ant-choice-layout-list')).toBeTruthy();

    const { container: gridContainer } = render(<Choice items={mockItems} layout="grid" />);
    expect(gridContainer.querySelector('.ant-choice-layout-grid')).toBeTruthy();

    const { container: cardContainer } = render(<Choice items={mockItems} layout="card" />);
    expect(cardContainer.querySelector('.ant-choice-layout-card')).toBeTruthy();
  });

  it('should render recommended badge', () => {
    const items = [
      { key: '1', label: 'A', recommended: true as const },
      { key: '2', label: 'B', recommended: 'secondary' as const },
    ];
    const { container } = render(<Choice items={items} />);
    expect(container.querySelector('.ant-choice-item-recommended-primary')).toBeTruthy();
    expect(container.querySelector('.ant-choice-item-recommended-secondary')).toBeTruthy();
  });

  it('should render confirm button when confirmable is true', () => {
    const { container } = render(<Choice items={mockItems} confirmable confirmText="Confirm" />);
    const btn = container.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn?.textContent).toContain('Confirm');
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const handleConfirm = jest.fn();
    const { getByText } = render(
      <Choice items={mockItems} confirmable onConfirm={handleConfirm} />,
    );
    fireEvent.click(getByText('Option 1'));
    fireEvent.click(getByText('Confirm'));
    expect(handleConfirm).toHaveBeenCalled();
  });

  it('should render loading skeleton', () => {
    const { container } = render(<Choice items={mockItems} loading />);
    expect(container.querySelector('.ant-choice-loading')).toBeTruthy();
  });

  it('should apply controlled value', () => {
    const { container } = render(<Choice items={mockItems} value="2" />);
    const selectedItems = container.querySelectorAll('.ant-choice-item-selected');
    expect(selectedItems).toHaveLength(1);
  });

  it('should apply defaultValue', () => {
    const { container } = render(<Choice items={mockItems} defaultValue="1" />);
    expect(container.querySelector('.ant-choice-item-selected')).toBeTruthy();
  });

  it('should apply fadeIn animation class', () => {
    const { container } = render(<Choice items={mockItems} fadeIn />);
    expect(container.querySelector('.ant-x-fade')).toBeTruthy();
  });

  it('should apply fadeInLeft animation class', () => {
    const { container } = render(<Choice items={mockItems} fadeInLeft />);
    expect(container.querySelector('.ant-x-fade-left')).toBeTruthy();
  });

  it('should apply custom classNames and styles', () => {
    const customClassNames = {
      root: 'custom-root',
      header: 'custom-header',
      list: 'custom-list',
      item: 'custom-item',
    };

    const { container } = render(
      <Choice items={mockItems} title="Title" classNames={customClassNames} />,
    );

    expect(container.querySelector('.custom-root')).toBeTruthy();
    expect(container.querySelector('.custom-list')).toBeTruthy();
    expect(container.querySelector('.custom-item')).toBeTruthy();
  });

  it('should render different indicators', () => {
    const { container: radioContainer } = render(<Choice items={mockItems} indicator="radio" />);
    expect(radioContainer.querySelector('.ant-choice-indicator')).toBeTruthy();

    const { container: checkContainer } = render(<Choice items={mockItems} indicator="check" />);
    expect(checkContainer.querySelector('.ant-choice-indicator')).toBeTruthy();

    const { container: numberContainer } = render(<Choice items={mockItems} indicator="number" />);
    expect(numberContainer.querySelector('.ant-choice-indicator-number')).toBeTruthy();

    const { container: noneContainer } = render(<Choice items={mockItems} indicator="none" />);
    expect(noneContainer.querySelector('.ant-choice-indicator')).toBeFalsy();
  });

  it('should render footer', () => {
    const { getByText } = render(<Choice items={mockItems} footer={<div>Custom Footer</div>} />);
    expect(getByText('Custom Footer')).toBeInTheDocument();
  });

  it('should render maxCount text in footer for multiple mode', () => {
    const { container } = render(
      <Choice items={mockItems} mode="multiple" maxCount={3} confirmable />,
    );
    expect(container.querySelector('.ant-choice-footer-count')).toBeTruthy();
  });

  it('should support keyboard navigation', () => {
    const handleChange = jest.fn();
    const { getByText } = render(<Choice items={mockItems} onChange={handleChange} />);
    const item = getByText('Option 1').closest('.ant-choice-item')!;
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalled();
  });

  it('should set correct data roles', () => {
    const { container } = render(<Choice items={mockItems} />);
    const list = container.querySelector('[data-role="radiogroup"]');
    expect(list).toBeTruthy();

    const { container: multiContainer } = render(<Choice items={mockItems} mode="multiple" />);
    const group = multiContainer.querySelector('[data-role="group"]');
    expect(group).toBeTruthy();
  });
});
