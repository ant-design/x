import { act, render } from '@testing-library/react';
import React from 'react';
import BubbleList from '../BubbleList';
import type { BubbleItemType, BubbleListRef } from '../interface';

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

describe('Bubble.List virtual scroll', () => {
  const mockItems: BubbleItemType[] = [
    { key: 'item1', role: 'user', content: '用户消息1' },
    { key: 'item2', role: 'ai', content: 'AI回复1' },
  ];

  it('should render virtual list when virtual is true', () => {
    const { container, getByTestId } = render(
      <BubbleList items={mockItems} virtual style={{ height: 500 }} />,
    );

    expect(getByTestId('mock-virtual-list')).toBeInTheDocument();
    // Should still render all items in mock mode
    const bubbles = container.querySelectorAll('.ant-bubble');
    expect(bubbles).toHaveLength(2);
  });

  it('should not render virtual list when virtual is false (default)', () => {
    const { container, queryByTestId } = render(<BubbleList items={mockItems} />);

    expect(queryByTestId('mock-virtual-list')).not.toBeInTheDocument();
    // Should render using the normal scroll box
    expect(container.querySelector('.ant-bubble-list-scroll-box')).toBeInTheDocument();
    expect(container.querySelector('.ant-bubble-list-scroll-content')).toBeInTheDocument();
  });

  it('should render all items correctly in virtual mode', () => {
    const { container } = render(
      <BubbleList items={mockItems} virtual style={{ height: 500 }} />,
    );

    expect(container).toHaveTextContent('用户消息1');
    expect(container).toHaveTextContent('AI回复1');
  });

  it('should support autoScroll in virtual mode', () => {
    const { container } = render(
      <BubbleList items={mockItems} virtual autoScroll style={{ height: 500 }} />,
    );

    const scrollBox = container.querySelector('.ant-bubble-list-scroll-box');
    expect(scrollBox).toHaveClass('ant-bubble-list-autoscroll');
  });

  it('should support autoScroll disabled in virtual mode', () => {
    const { container } = render(
      <BubbleList items={mockItems} virtual autoScroll={false} style={{ height: 500 }} />,
    );

    const scrollBox = container.querySelector('.ant-bubble-list-scroll-box');
    expect(scrollBox).not.toHaveClass('ant-bubble-list-autoscroll');
  });

  it('should support ref in virtual mode', () => {
    const ref = React.createRef<BubbleListRef>();
    render(<BubbleList items={mockItems} virtual ref={ref} style={{ height: 500 }} />);

    expect(ref.current).toBeTruthy();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLElement);
    expect(typeof ref.current!.scrollTo).toBe('function');
  });

  it('should handle empty items in virtual mode', () => {
    const { container } = render(<BubbleList items={[]} virtual style={{ height: 500 }} />);

    const bubbles = container.querySelectorAll('.ant-bubble');
    expect(bubbles).toHaveLength(0);
  });

  it('should handle large number of items in virtual mode', () => {
    const largeItems: BubbleItemType[] = Array.from({ length: 1000 }, (_, i) => ({
      key: `item-${i}`,
      role: i % 2 === 0 ? 'user' : 'ai',
      content: `消息 ${i}`,
    }));

    const { container } = render(
      <BubbleList items={largeItems} virtual style={{ height: 500 }} />,
    );

    // In mock mode, all items are rendered
    const bubbles = container.querySelectorAll('.ant-bubble');
    expect(bubbles).toHaveLength(1000);
  });

  it('should support role configuration in virtual mode', () => {
    const roleConfig = {
      user: { placement: 'end' as const },
      ai: { placement: 'start' as const },
    };

    const { container } = render(
      <BubbleList items={mockItems} role={roleConfig} virtual style={{ height: 500 }} />,
    );

    const bubbles = container.querySelectorAll('.ant-bubble');
    expect(bubbles[0]).toHaveClass('ant-bubble-end');
    expect(bubbles[1]).toHaveClass('ant-bubble-start');
  });

  it('should support onScroll in virtual mode', () => {
    const onScroll = jest.fn();
    const { getByTestId } = render(
      <BubbleList items={mockItems} virtual onScroll={onScroll} style={{ height: 500 }} />,
    );

    // onScroll is passed to VirtualList, mock renders it as a prop
    // Just verify the component renders without error
    expect(getByTestId('mock-virtual-list')).toBeInTheDocument();
  });

  it('should switch between virtual and non-virtual mode', () => {
    const { container, rerender, queryByTestId } = render(
      <BubbleList items={mockItems} virtual style={{ height: 500 }} />,
    );

    expect(queryByTestId('mock-virtual-list')).toBeInTheDocument();

    rerender(<BubbleList items={mockItems} virtual={false} style={{ height: 500 }} />);

    expect(queryByTestId('mock-virtual-list')).not.toBeInTheDocument();
    expect(container.querySelector('.ant-bubble-list-scroll-content')).toBeInTheDocument();
  });

  it('should support scrollTo via ref in virtual mode', () => {
    const ref = React.createRef<BubbleListRef>();
    const { container } = render(
      <BubbleList items={mockItems} virtual ref={ref} autoScroll={false} style={{ height: 500 }} />,
    );

    // Should not throw
    act(() => {
      ref.current!.scrollTo({ top: 100, behavior: 'smooth' });
    });

    act(() => {
      ref.current!.scrollTo({ top: 'bottom' });
    });

    act(() => {
      ref.current!.scrollTo({ key: 'item1' });
    });

    expect(ref.current).toBeTruthy();
  });

  it('should support divider and system roles in virtual mode', () => {
    const items: BubbleItemType[] = [
      { key: 'd1', role: 'divider', content: '分割线' },
      { key: 's1', role: 'system', content: '系统消息' },
      { key: 'u1', role: 'user', content: '用户消息' },
    ];

    const { container } = render(
      <BubbleList items={items} virtual autoScroll={false} style={{ height: 500 }} />,
    );

    expect(container.querySelector('.ant-bubble-divider')).toBeInTheDocument();
    expect(container.querySelector('.ant-bubble-system')).toBeInTheDocument();
    expect(container.querySelectorAll('.ant-bubble')).toHaveLength(3);
  });

  it('should apply styles and classNames in virtual mode', () => {
    const { container } = render(
      <BubbleList
        items={mockItems}
        virtual
        className="custom-class"
        style={{ height: 500, backgroundColor: 'red' }}
        classNames={{ root: 'root-class' }}
        styles={{ root: { margin: '10px' } }}
      />,
    );

    const listElement = container.querySelector('.ant-bubble-list');
    expect(listElement).toHaveClass('custom-class');
    expect(listElement).toHaveClass('root-class');
    expect(listElement).toHaveStyle({ backgroundColor: 'red', margin: '10px' });
  });
});