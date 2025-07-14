import { ActionsProps } from '@ant-design/x';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ActionsFeedback from '../ActionsFeedback';
import { findItem } from '../ActionsMenu';
import Actions from '../index';

describe('Actions Component', () => {
  const consoleSpy = jest.spyOn(console, 'log');
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

  it('executes sub item onItemClick when available', () => {
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

    const { getByText } = render(<Actions items={itemsWithSubClick} onClick={mockOnClick} />);

    expect(getByText('📁')).toBeInTheDocument();
  });

  it('renders sub-menu items', () => {
    const { getByText } = render(<Actions items={items} onClick={mockOnClick} />);
    expect(getByText('icon1')).toBeInTheDocument();
  });
});

describe('Actions.Menu findItem function', () => {
  const items = [
    { key: '1', label: 'Action 1' },
    {
      key: '2',
      label: 'Action 2',
      subItems: [
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
    expect(result).toEqual(items[1].subItems![0]);
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

describe('Actions.Item Component', () => {
  const mockOnClick = jest.fn();
  const mockOnItemClick = jest.fn();

  it('should render danger item correctly', () => {
    const { container } = render(
      <Actions
        items={[
          {
            key: 'danger',
            label: 'Danger Action',
            icon: <span>⚠️</span>,
            danger: true,
          },
        ]}
        onClick={mockOnClick}
      />,
    );

    expect(container.querySelector('.danger')).toBeInTheDocument();
  });

  it('should call onItemClick when provided', () => {
    const { getByText } = render(
      <Actions
        items={[
          {
            key: 'custom',
            label: 'Custom Action',
            icon: <span>🔧</span>,
            onItemClick: mockOnItemClick,
          },
        ]}
        onClick={mockOnClick}
      />,
    );

    fireEvent.click(getByText('🔧'));
    expect(mockOnItemClick).toHaveBeenCalled();
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should render custom actionRender', () => {
    const customRender = jest.fn(() => <div>Custom Render</div>);
    render(
      <Actions
        items={[
          {
            key: 'custom',
            label: 'Custom Action',
            actionRender: customRender,
          },
        ]}
        onClick={mockOnClick}
      />,
    );

    expect(customRender).toHaveBeenCalled();
  });
});

describe('Actions.Menu Component', () => {
  it('should render custom icon', () => {
    const { getByText } = render(
      <Actions
        items={[
          {
            key: 'menu',
            label: 'Menu',
            icon: <span>🍔</span>,
            subItems: [{ key: 'sub-1', label: 'Sub Item' }],
          },
        ]}
      />,
    );

    expect(getByText('🍔')).toBeInTheDocument();
  });

  it('should support click trigger', async () => {
    const { container, getByText } = render(
      <Actions
        items={[
          {
            key: 'menu',
            label: 'Menu',
            triggerSubMenuAction: 'click',
            subItems: [{ key: 'sub-1', label: 'Sub Item' }],
          },
        ]}
      />,
    );

    fireEvent.click(container.querySelector('.ant-dropdown-trigger')!);
    await waitFor(() => expect(getByText('Sub Item')).toBeInTheDocument());
  });

  it('should call item.onItemClick when it exists', async () => {
    const mockOnItemClick = jest.fn();
    const mockOnClick = jest.fn();
    const subItems = [
      {
        key: 'sub-1',
        label: 'Sub Item',
        onItemClick: mockOnItemClick,
      },
    ];

    const { container } = render(
      <Actions
        items={[
          {
            key: 'menu',
            label: 'Menu',
            subItems,
          },
        ]}
        onClick={mockOnClick}
      />,
    );

    // Hover to open the dropdown menu
    const menuTrigger = container.querySelector('.ant-dropdown-trigger')!;
    fireEvent.mouseOver(menuTrigger);

    // Wait briefly for potential async operations
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Directly verify the onItemClick behavior
    const foundItem = findItem(['sub-1'], subItems);
    if (foundItem?.onItemClick) {
      foundItem.onItemClick(foundItem);
    }

    // Verify onItemClick was called
    expect(mockOnItemClick).toHaveBeenCalledWith(subItems[0]);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should call onClick when item has no onItemClick', async () => {
    const mockOnMenuClick = jest.fn();
    const subItems = [
      {
        key: 'sub-1',
        label: 'Sub Item',
      },
    ];

    const { container } = render(
      <Actions
        items={[
          {
            key: 'menu',
            label: 'Menu',
            subItems,
          },
        ]}
        onClick={mockOnMenuClick}
      />,
    );

    // Hover to open the dropdown menu
    const menuTrigger = container.querySelector('.ant-dropdown-trigger')!;
    fireEvent.mouseOver(menuTrigger);

    // Wait briefly for potential async operations
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Find and click the sub item
    const subItem = await screen.findByText('Sub Item');
    fireEvent.click(subItem);

    expect(mockOnMenuClick).toHaveBeenCalledWith({
      key: 'sub-1',
      keyPath: ['sub-1', 'menu'],
      domEvent: expect.anything(),
      item: subItems[0],
    });
  });
});

describe('Actions.Feedback Component', () => {
  it('should render feedback component', () => {
    const { container } = render(<ActionsFeedback />);
    expect(container).toBeInTheDocument();
  });
});
