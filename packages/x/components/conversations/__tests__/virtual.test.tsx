import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import Conversations from '../index';
import type { ItemType } from '../index';

// Mock @rc-component/virtual-list
jest.mock('@rc-component/virtual-list', () => {
  const React = require('react');
  const MockVirtualList = React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      scrollTo: jest.fn(),
      nativeElement: null,
    }));
    const { data, children, itemKey, virtual, itemHeight, height, ...rest } = props;
    return (
      <div data-testid="mock-virtual-list" {...rest}>
        {data?.map((item: any, index: number) => (
          <div key={itemKey ? itemKey(item) : index}>{children(item, index)}</div>
        ))}
      </div>
    );
  });
  return { __esModule: true, default: MockVirtualList };
});

const items: ItemType[] = [
  { key: 'demo1', label: 'Conversation 1', group: 'Today' },
  { key: 'demo2', label: 'Conversation 2', group: 'Today' },
  { key: 'demo3', label: 'Conversation 3', group: 'Yesterday' },
  { key: 'demo4', label: 'Conversation 4', group: 'Yesterday' },
  { key: 'demo5', label: 'Conversation 5' },
];

describe('Conversations virtual scroll', () => {
  it('should render virtual list when virtual is true', () => {
    const { getByTestId } = render(
      <Conversations items={items} virtual groupable style={{ height: 400 }} />,
    );

    expect(getByTestId('mock-virtual-list')).toBeInTheDocument();
  });

  it('should not render virtual list when virtual is false (default)', () => {
    const { queryByTestId } = render(<Conversations items={items} groupable />);

    expect(queryByTestId('mock-virtual-list')).not.toBeInTheDocument();
  });

  it('should render all items in virtual mode', () => {
    const { container } = render(
      <Conversations items={items} virtual groupable style={{ height: 400 }} />,
    );

    expect(container).toHaveTextContent('Conversation 1');
    expect(container).toHaveTextContent('Conversation 2');
    expect(container).toHaveTextContent('Conversation 3');
    expect(container).toHaveTextContent('Conversation 4');
    expect(container).toHaveTextContent('Conversation 5');
  });

  it('should render group titles in virtual mode', () => {
    const { container } = render(
      <Conversations items={items} virtual groupable style={{ height: 400 }} />,
    );

    expect(container).toHaveTextContent('Today');
    expect(container).toHaveTextContent('Yesterday');
  });

  it('should support activeKey in virtual mode', () => {
    const { container } = render(
      <Conversations items={items} virtual groupable activeKey="demo1" style={{ height: 400 }} />,
    );

    const activeItem = container.querySelector('.ant-conversations-item-active');
    expect(activeItem).toBeInTheDocument();
  });

  it('should support onActiveChange in virtual mode', () => {
    const onActiveChange = jest.fn();
    const { getByText } = render(
      <Conversations
        items={items}
        virtual
        groupable
        onActiveChange={onActiveChange}
        style={{ height: 400 }}
      />,
    );

    fireEvent.click(getByText('Conversation 1'));
    expect(onActiveChange).toHaveBeenCalledWith(
      'demo1',
      expect.objectContaining({ key: 'demo1' }),
    );
  });

  it('should handle large number of items in virtual mode', () => {
    const largeItems: ItemType[] = Array.from({ length: 1000 }, (_, i) => ({
      key: `item-${i}`,
      label: `Conversation ${i}`,
      group: i < 333 ? 'Today' : i < 666 ? 'Yesterday' : 'Earlier',
    }));

    const { container } = render(
      <Conversations items={largeItems} virtual groupable style={{ height: 400 }} />,
    );

    // Should render without error
    expect(container.querySelector('.ant-conversations')).toBeInTheDocument();
  });

  it('should handle empty items in virtual mode', () => {
    const { container } = render(
      <Conversations items={[]} virtual groupable style={{ height: 400 }} />,
    );

    expect(container.querySelector('.ant-conversations')).toBeInTheDocument();
  });

  it('should switch between virtual and non-virtual mode', () => {
    const { rerender, queryByTestId, container } = render(
      <Conversations items={items} virtual groupable style={{ height: 400 }} />,
    );

    expect(queryByTestId('mock-virtual-list')).toBeInTheDocument();

    rerender(<Conversations items={items} virtual={false} groupable style={{ height: 400 }} />);

    expect(queryByTestId('mock-virtual-list')).not.toBeInTheDocument();
    expect(container.querySelector('.ant-conversations')).toBeInTheDocument();
  });

  it('should support ref in virtual mode', () => {
    const ref = React.createRef<any>();
    render(
      <Conversations items={items} virtual groupable ref={ref} style={{ height: 400 }} />,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current.nativeElement).toBeInstanceOf(HTMLElement);
  });

  it('should support disabled items in virtual mode', () => {
    const itemsWithDisabled: ItemType[] = [
      { key: '1', label: 'Active Item' },
      { key: '2', label: 'Disabled Item', disabled: true } as any,
    ];

    const { container } = render(
      <Conversations
        items={itemsWithDisabled}
        virtual
        style={{ height: 400 }}
      />,
    );

    const disabledItem = container.querySelector('.ant-conversations-item-disabled');
    expect(disabledItem).toBeInTheDocument();
  });

  it('should work without groupable in virtual mode', () => {
    const { container } = render(
      <Conversations items={items} virtual style={{ height: 400 }} />,
    );

    expect(container).toHaveTextContent('Conversation 1');
    expect(container).toHaveTextContent('Conversation 5');
  });

  it('should support custom groupable label in virtual mode', () => {
    const { getByText } = render(
      <Conversations
        items={items}
        virtual
        groupable={{ label: (group) => <div>Custom: {group}</div> }}
        style={{ height: 400 }}
      />,
    );

    expect(getByText('Custom: Today')).toBeInTheDocument();
  });
});