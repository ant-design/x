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

  it('should call onItemClick when a button is clicked', () => {
    const { getByText } = render(<Prompts {...mockProps} />);
    const button = getByText(/label 1/i);
    fireEvent.click(button);
    expect(mockProps.onItemClick).toHaveBeenCalledWith({ data: mockData[0] });
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

  it('should not trigger onItemClick for nested parent items', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Prompts items={nestedData} onItemClick={handleClick} />);

    fireEvent.click(getByText('Parent Label'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should trigger onItemClick for nested child items', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Prompts items={nestedData} onItemClick={handleClick} />);

    fireEvent.click(getByText('Child 1'));
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

  it('should not trigger onItemClick for disabled items', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Prompts items={mockData} onItemClick={handleClick} />);

    fireEvent.click(getByText('Label 2'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should combine vertical and wrap props correctly', () => {
    const { container } = render(<Prompts items={mockData} vertical wrap />);
    expect(container.querySelector('.ant-prompts-list-vertical')).toBeTruthy();
    expect(container.querySelector('.ant-prompts-list-wrap')).toBeTruthy();
  });
});
