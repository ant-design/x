import { render } from '@testing-library/react';
import React from 'react';
import BubbleList from '../BubbleList';
import type { BubbleItemType } from '../interface';

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

describe('Bubble.List benchmark - 1000+ items', () => {
  const generateLargeItems = (count: number): BubbleItemType[] =>
    Array.from({ length: count }, (_, i) => ({
      key: `item-${i}`,
      role: i % 3 === 0 ? 'ai' : i % 3 === 1 ? 'user' : 'system',
      content: `Message content ${i} - ${'lorem ipsum '.repeat(i % 10)}`,
    }));

  it('should render 1000 items correctly in virtual mode', () => {
    const items = generateLargeItems(1000);
    const { container } = render(
      <BubbleList items={items} virtual style={{ height: 600 }} />,
    );

    const bubbles = container.querySelectorAll('.ant-bubble');
    expect(bubbles).toHaveLength(1000);
    expect(container).toHaveTextContent('Message content 0');
    expect(container).toHaveTextContent('Message content 999');
  });

  it('should render 1000 items correctly in non-virtual mode', () => {
    const items = generateLargeItems(1000);
    const { container } = render(
      <BubbleList items={items} style={{ height: 600 }} />,
    );

    const bubbles = container.querySelectorAll('.ant-bubble');
    expect(bubbles).toHaveLength(1000);
  });

  it('should render 2000+ items in virtual mode', () => {
    const items = generateLargeItems(2000);
    const { container } = render(
      <BubbleList items={items} virtual style={{ height: 600 }} />,
    );

    const bubbles = container.querySelectorAll('.ant-bubble');
    expect(bubbles).toHaveLength(2000);
    expect(container).toHaveTextContent('Message content 1999');
  });

  it('should handle mixed role types in large data', () => {
    const items: BubbleItemType[] = Array.from({ length: 1000 }, (_, i) => {
      if (i % 100 === 0) return { key: `d-${i}`, role: 'divider', content: `Divider ${i}` };
      if (i % 50 === 0) return { key: `s-${i}`, role: 'system', content: `System ${i}` };
      return { key: `m-${i}`, role: i % 2 === 0 ? 'ai' : 'user', content: `Msg ${i}` };
    });

    const { container } = render(
      <BubbleList items={items} virtual autoScroll={false} style={{ height: 600 }} />,
    );

    const dividers = container.querySelectorAll('.ant-bubble-divider');
    const systems = container.querySelectorAll('.ant-bubble-system');
    const bubbles = container.querySelectorAll('.ant-bubble');

    expect(bubbles.length).toBe(1000);
    expect(dividers.length).toBe(10);
    expect(systems.length).toBe(10);
  });

  it('should correctly update when items change in virtual mode', () => {
    const initialItems = generateLargeItems(500);
    const { container, rerender } = render(
      <BubbleList items={initialItems} virtual style={{ height: 600 }} />,
    );

    expect(container.querySelectorAll('.ant-bubble')).toHaveLength(500);

    const updatedItems = generateLargeItems(1000);
    rerender(<BubbleList items={updatedItems} virtual style={{ height: 600 }} />);

    expect(container.querySelectorAll('.ant-bubble')).toHaveLength(1000);
    expect(container).toHaveTextContent('Message content 999');
  });

  it('should measure render time for 1000 items', () => {
    const items = generateLargeItems(1000);

    const start = performance.now();
    render(<BubbleList items={items} virtual style={{ height: 600 }} />);
    const end = performance.now();

    // Virtual mode should render reasonably fast even with 1000 items
    // (In mock mode all items render, but the test verifies correctness)
    expect(end - start).toBeLessThan(5000);
  });
});