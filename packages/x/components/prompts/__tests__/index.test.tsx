import userEvent from '@testing-library/user-event';
import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render } from '../../../tests/utils';
import Prompts from '..';

// Mock data
const mockData = [
  {
    key: '1',
    label: 'Label 1',
    description: 'Description 1',
    icon: <span>Icon 1</span>,
    disabled: false,
  },
  {
    key: '2',
    label: 'Label 2',
    description: 'Description 2',
    icon: <span>Icon 2</span>,
    disabled: true,
  },
];

const nestedData = [
  {
    key: 'parent',
    label: 'Parent Label',
    description: 'Parent Description',
    children: [
      {
        key: 'child1',
        label: 'Child 1',
        description: 'Child Description 1',
      },
      {
        key: 'child2',
        label: 'Child 2',
        description: 'Child Description 2',
        disabled: true,
      },
    ],
  },
];

const mockProps = {
  title: 'Test Title',
  items: mockData,
  onItemClick: jest.fn(),
  prefixCls: 'custom',
};

describe('prompts', () => {
  mountTest(() => <Prompts />);
  rtlTest(() => <Prompts />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render the title', () => {
    const { getByText } = render(<Prompts title={mockProps.title} />);
    const titleElement = getByText(/test title/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('should render the correct number of items', () => {
    const { container } = render(<Prompts items={mockProps.items} />);
    expect(container.querySelectorAll('.ant-prompts-item')).toHaveLength(mockData.length);
  });

  it('should render the labels and descriptions', () => {
    const { getByText } = render(<Prompts {...mockProps} />);
    mockData.forEach((item) => {
      const label = getByText(item.label);
      const description = getByText(item.description);
      expect(label).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });

  it('should render interactive leaf items as accessible buttons', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<Prompts items={mockData} onItemClick={handleClick} />);

    expect(getByRole('button', { name: /label 1 description 1/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /label 2 description 2/i })).toBeDisabled();
  });

  it('should call onItemClick once for mouse and keyboard activation', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { getByRole } = render(<Prompts items={mockData} onItemClick={handleClick} />);
    const button = getByRole('button', { name: /label 1 description 1/i });

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenLastCalledWith({ data: mockData[0] });

    button.focus();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(2);
    expect(handleClick).toHaveBeenLastCalledWith({ data: mockData[0] });

    await user.keyboard('[Space]');
    expect(handleClick).toHaveBeenCalledTimes(3);
    expect(handleClick).toHaveBeenLastCalledWith({ data: mockData[0] });
  });

  it('should disable buttons correctly', () => {
    const { container } = render(<Prompts items={mockProps.items} />);
    expect(container.querySelector('.ant-prompts-item-disabled')).toBeTruthy();
  });

  it('should render icons', () => {
    const { getByText } = render(<Prompts items={mockProps.items} />);
    mockData.forEach((item) => {
      if (item.icon) {
        const icon = getByText(`Icon ${item.key}`);
        expect(icon).toBeInTheDocument();
      }
    });
  });

  it('should apply vertical layout class when vertical is true', () => {
    const { container } = render(<Prompts items={mockData} vertical />);
    expect(container.querySelector('.ant-prompts-list-vertical')).toBeTruthy();
  });

  it('should apply wrap layout class when wrap is true', () => {
    const { container } = render(<Prompts items={mockData} wrap />);
    expect(container.querySelector('.ant-prompts-list-wrap')).toBeTruthy();
  });

  it('should render nested children correctly', () => {
    const { container, getByText } = render(<Prompts items={nestedData} />);

    expect(getByText('Parent Label')).toBeInTheDocument();
    expect(getByText('Parent Description')).toBeInTheDocument();
    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();

    expect(container.querySelector('.ant-prompts-item-has-nest')).toBeTruthy();
    expect(container.querySelector('.ant-prompts-nested')).toBeTruthy();
  });

  it('should not expose static or nested parent items as buttons', () => {
    const handleClick = jest.fn();
    const { getByRole, queryByRole, getByText } = render(
      <Prompts
        items={nestedData}
        onItemClick={handleClick}
      />,
    );

    expect(getByRole('button', { name: /child 1 child description 1/i })).toBeInTheDocument();
    expect(queryByRole('button', { name: /parent label parent description/i })).toBeNull();

    fireEvent.click(getByText('Parent Label'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should trigger onItemClick for nested child items', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<Prompts items={nestedData} onItemClick={handleClick} />);

    fireEvent.click(getByRole('button', { name: /child 1 child description 1/i }));
    expect(handleClick).toHaveBeenCalledWith({
      data: nestedData[0].children[0],
    });
  });

  it('should apply fadeIn animation class when fadeIn is true', () => {
    const { container } = render(<Prompts items={mockData} fadeIn />);
    expect(container.querySelector('.ant-x-fade')).toBeTruthy();
  });

  it('should apply fadeInLeft animation class when fadeInLeft is true', () => {
    const { container } = render(<Prompts items={mockData} fadeInLeft />);
    expect(container.querySelector('.ant-x-fade-left')).toBeTruthy();
  });

  it('should apply custom classNames and styles', () => {
    const customClassNames = {
      root: 'custom-root',
      list: 'custom-list',
      item: 'custom-item',
      itemContent: 'custom-content',
      title: 'custom-title',
    };

    const customStyles = {
      root: { backgroundColor: 'red' },
      list: { padding: '10px' },
      item: { margin: '5px' },
      itemContent: { color: 'blue' },
      title: { fontSize: '20px' },
    };

    const { container } = render(
      <Prompts
        items={mockData}
        title="Styled Title"
        classNames={customClassNames}
        styles={customStyles}
      />,
    );

    expect(container.querySelector('.custom-root')).toBeTruthy();
    expect(container.querySelector('.custom-list')).toBeTruthy();
    expect(container.querySelector('.custom-item')).toBeTruthy();
    expect(container.querySelector('.custom-content')).toBeTruthy();
    expect(container.querySelector('.custom-title')).toBeTruthy();
  });

  it('should not trigger onItemClick for disabled items', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { getByRole } = render(<Prompts items={mockData} onItemClick={handleClick} />);
    const button = getByRole('button', { name: /label 2 description 2/i });

    fireEvent.click(button);
    await user.keyboard('{Enter}');
    await user.keyboard('{Space}');
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not render any buttons without an onItemClick callback', () => {
    const { queryAllByRole } = render(<Prompts items={mockData} />);

    expect(queryAllByRole('button')).toHaveLength(0);
  });

  it('should combine vertical and wrap props correctly', () => {
    const { container } = render(<Prompts items={mockData} vertical wrap />);
    expect(container.querySelector('.ant-prompts-list-vertical')).toBeTruthy();
    expect(container.querySelector('.ant-prompts-list-wrap')).toBeTruthy();
  });
});
