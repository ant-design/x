import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { findItem } from '../ActionMenu';
import Actions, { ActionsProps } from '../index'; // Adjust the import according to your file structure
import { ItemType } from '../interface';

describe('Actions Component', () => {
  const consoleSpy = jest.spyOn(console, 'log'); // apy on console.log
  const mockOnClick = jest.fn();
  const items = [
    { key: '1', label: 'Action 1', icon: <span>icon1</span> },
    {
      key: '2',
      label: 'Action 2',
      icon: <span>icon2</span>,
      onItemClick: () => console.log('Action 2 clicked'),
    },
    {
      key: 'sub',
      children: [{ key: 'sub-1', label: 'Sub Action 1', icon: <span>⚙️</span> }],
    },
  ];

  it('renders correctly', () => {
    const { getByText } = render(<Actions items={items} onClick={mockOnClick} />);

    expect(getByText('icon1')).toBeInTheDocument();
    expect(getByText('icon2')).toBeInTheDocument();
  });

  it('calls onClick when an action item is clicked', () => {
    const onClick: ActionsProps['onClick'] = ({ keyPath }) => {
      console.log(`You clicked ${keyPath.join(',')}`);
    };
    const { getByText } = render(<Actions items={items} onClick={onClick} />);

    fireEvent.click(getByText('icon1'));
    expect(consoleSpy).toHaveBeenCalledWith('You clicked 1');
  });

  it('calls individual item onClick if provided', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const { getByText } = render(<Actions items={items} onClick={mockOnClick} />);

    fireEvent.click(getByText('icon2'));
    expect(consoleSpy).toHaveBeenCalledWith('Action 2 clicked');
    consoleSpy.mockRestore();
  });

  it('executes sub item onItemClick when available', async () => {
    const subItemClick = jest.fn();
    const itemsWithSubClick = [
      {
        key: 'parent',
        label: 'Parent Action',
        icon: <span>📁</span>,
        children: [
          {
            key: 'sub-1',
            label: 'Sub Action 1',
            icon: <span>⚙️</span>,
            onItemClick: subItemClick,
          },
        ],
      },
    ];

    const { getByText, container } = render(
      <Actions items={itemsWithSubClick} onClick={mockOnClick} />,
    );

    const parentTrigger = container.querySelector('.ant-dropdown-trigger')!;
    fireEvent.mouseOver(parentTrigger);

    await waitFor(() => expect(getByText('⚙️')).toBeInTheDocument());

    fireEvent.click(getByText('⚙️'));

    expect(subItemClick).toHaveBeenCalledWith(expect.objectContaining({ key: 'sub-1' }));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('renders sub-menu items', async () => {
    const { getByText, container } = render(<Actions items={items} onClick={mockOnClick} />);

    fireEvent.mouseOver(container.querySelector('.ant-dropdown-trigger')!); // Assuming the dropdown opens on hover

    await waitFor(() => expect(getByText('Sub Action 1')).toBeInTheDocument());
  });
});

describe('Actions.Menu findItem function', () => {
  const items: ItemType[] = [
    { key: '1', label: 'Action 1' },
    {
      key: '2',
      label: 'Action 2',
      children: [
        { key: '2-1', label: 'Sub Action 1' },
        { key: '2-2', label: 'Sub Action 2' },
      ],
    },
    { key: '3', label: 'Action 3' },
  ];

  it('should return the item if it exists at the root level', () => {
    const result = findItem(['1'], items);
    expect(result).toEqual(items[0]);
  });

  it('should return the item if it exists at a deeper level', () => {
    const result = findItem(['2', '2-1'], items);
    expect(result).toEqual(items[1].children![0]);
  });

  it('should return null if the item does not exist', () => {
    const result = findItem(['4'], items);
    expect(result).toBeNull();
  });

  it('should return null when searching a non-existent sub-item', () => {
    const result = findItem(['2', '2-3'], items);
    expect(result).toBeNull();
  });

  it('should handle an empty keyPath gracefully', () => {
    const result = findItem([], items);
    expect(result).toBeNull();
  });
});
