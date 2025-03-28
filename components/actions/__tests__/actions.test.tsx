import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import Actions, { ActionsProps } from '../index'; // Adjust the import according to your file structure

describe('Actions Component', () => {
  const consoleSpy = jest.spyOn(console, 'log'); // 监视 console.log
  const mockOnClick = jest.fn();
  const items = [
    { key: '1', label: 'Action 1', icon: <span>icon1</span> },
    {
      key: '2',
      label: 'Action 2',
      icon: <span>icon2</span>,
      onClick: () => console.log('Action 2 clicked'),
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

  it('renders sub-menu items', async () => {
    const { getByText, container } = render(<Actions items={items} onClick={mockOnClick} />);

    fireEvent.mouseOver(container.querySelector('.ant-dropdown-trigger')!); // Assuming the dropdown opens on hover

    await waitFor(() => expect(getByText('Sub Action 1')).toBeInTheDocument());
  });
});
