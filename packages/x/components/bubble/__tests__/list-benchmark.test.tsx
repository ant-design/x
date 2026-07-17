import { render } from '@testing-library/react';
import React from 'react';
import BubbleList from '../BubbleList';
import type { BubbleItemType } from '../interface';

describe('Bubble.List benchmark - 1000+ items (real VirtualList)', () => {
  const generateLargeItems = (count: number): BubbleItemType[] =>
    Array.from({ length: count }, (_, i) => ({
      key: `item-${i}`,
      role: (i % 3 === 0 ? 'ai' : i % 3 === 1 ? 'user' : 'system') as BubbleItemType['role'],
      content: `Message content ${i} - ${'lorem ipsum '.repeat(i % 10)}`,
    }));

  it('should render 1000 items in virtual mode without crash', () => {
    const items = generateLargeItems(1000);
    const { container } = render(<BubbleList items={items} virtual style={{ height: 600 }} />);

    // Should render without crash
    expect(container.querySelector('.ant-bubble-list')).toBeInTheDocument();
  });

  it('should render 1000 items in non-virtual mode (all DOM nodes)', () => {
    const items = generateLargeItems(1000);
    const { container } = render(<BubbleList items={items} style={{ height: 600 }} />);

    const bubbles = container.querySelectorAll('.ant-bubble');
    expect(bubbles).toHaveLength(1000);
  });

  it('should render 2000+ items in virtual mode without crash', () => {
    const items = generateLargeItems(2000);
    const { container } = render(<BubbleList items={items} virtual style={{ height: 600 }} />);

    expect(container.querySelector('.ant-bubble-list')).toBeInTheDocument();
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

    expect(container.querySelector('.ant-bubble-list')).toBeInTheDocument();
  });

  it('should correctly update when items change in virtual mode', () => {
    const initialItems = generateLargeItems(500);
    const { container, rerender } = render(
      <BubbleList items={initialItems} virtual style={{ height: 600 }} />,
    );

    expect(container.querySelector('.ant-bubble-list')).toBeInTheDocument();

    const updatedItems = generateLargeItems(1000);
    rerender(<BubbleList items={updatedItems} virtual style={{ height: 600 }} />);

    expect(container.querySelector('.ant-bubble-list')).toBeInTheDocument();
  });

  it('should measure render time for 1000 items in virtual mode', () => {
    const items = generateLargeItems(1000);

    const start = performance.now();
    render(<BubbleList items={items} virtual style={{ height: 600 }} />);
    const end = performance.now();

    // Should render without crash in reasonable time
    expect(end - start).toBeLessThan(10000);
  });
});
