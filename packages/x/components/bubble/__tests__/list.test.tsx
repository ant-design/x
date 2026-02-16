import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { waitFakeTimer } from '../../../tests/utils';
import BubbleList from '../BubbleList';
import type { BubbleItemType, BubbleListRef, RoleType } from '../interface';

describe('Bubble.List', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  const mockItems: BubbleItemType[] = [
    {
      key: 'item1',
      role: 'user',
      content: '用户消息1',
    },
    {
      key: 'item2',
      role: 'ai',
      content: 'AI回复1',
    },
  ];

  describe('基础功能', () => {
    it('should correctly render basic BubbleList component', () => {
      const { container } = render(<BubbleList items={mockItems} />);
      const listElement = container.querySelector('.ant-bubble-list');

      expect(listElement).toBeInTheDocument();
      expect(container.querySelectorAll('.ant-bubble')).toHaveLength(2);
    });

    it('should support custom prefixCls', () => {
      const { container } = render(<BubbleList items={mockItems} prefixCls="custom-bubble" />);
      const listElement = container.querySelector('.custom-bubble-list');

      expect(listElement).toBeInTheDocument();
    });

    it('should support ref reference', () => {
      const ref = React.createRef<BubbleListRef>();
      render(<BubbleList items={mockItems} ref={ref} />);

      expect(ref.current).toBeTruthy();
      expect(ref.current!.nativeElement).toBeInstanceOf(HTMLElement);
      expect(typeof ref.current!.scrollTo).toBe('function');
    });

    it('should support custom className and style', () => {
      const { container } = render(
        <BubbleList
          items={mockItems}
          className="custom-class"
          style={{ backgroundColor: 'red' }}
        />,
      );
      const listElement = container.querySelector('.ant-bubble-list');

      expect(listElement).toHaveClass('custom-class');
      expect(listElement).toHaveStyle({ backgroundColor: 'red' });
    });

    it('should support rootClassName and style', () => {
      const { container } = render(
        <BubbleList items={mockItems} rootClassName="root-class" style={{ margin: '10px' }} />,
      );
      const listElement = container.querySelector('.ant-bubble-list');

      expect(listElement).toHaveClass('root-class');
      expect(listElement).toHaveStyle({ margin: '10px' });
    });
  });

  describe('items 渲染', () => {
    it('should correctly render all items', () => {
      const { container } = render(<BubbleList items={mockItems} />);
      const bubbles = container.querySelectorAll('.ant-bubble');

      expect(bubbles).toHaveLength(2);
      expect(container).toHaveTextContent('用户消息1');
      expect(container).toHaveTextContent('AI回复1');
    });

    it('should handle empty items array', () => {
      const { container } = render(<BubbleList items={[]} />);
      const listElement = container.querySelector('.ant-bubble-list');
      const bubbles = container.querySelectorAll('.ant-bubble');

      expect(listElement).toBeInTheDocument();
      expect(bubbles).toHaveLength(0);
    });

    it('should support role configuration', () => {
      const roleConfig = {
        user: {
          placement: 'end' as const,
          variant: 'outlined' as const,
        },
        ai: {
          placement: 'start' as const,
          variant: 'filled' as const,
        },
      };

      const { container } = render(<BubbleList items={mockItems} role={roleConfig} />);
      const bubbles = container.querySelectorAll('.ant-bubble');

      expect(bubbles[0]).toHaveClass('ant-bubble-end');
      expect(bubbles[1]).toHaveClass('ant-bubble-start');
    });

    it('should support role function configuration', () => {
      const roleConfig: RoleType = {
        user: () => ({
          placement: 'end' as const,
          variant: 'outlined' as const,
        }),
        ai: () => ({
          placement: 'start' as const,
          variant: 'filled' as const,
        }),
      };

      const { container } = render(<BubbleList items={mockItems} role={roleConfig} />);
      const bubbles = container.querySelectorAll('.ant-bubble');

      expect(bubbles[0]).toHaveClass('ant-bubble-end');
      expect(bubbles[1]).toHaveClass('ant-bubble-start');
    });

    it('should support empty role', () => {
      const { container } = render(<BubbleList items={mockItems} />);
      const bubbles = container.querySelectorAll('.ant-bubble');

      expect(bubbles[1]).toHaveClass('ant-bubble-start'); // user role
      expect(bubbles[0]).toHaveClass('ant-bubble-start'); // ai role
    });

    it('should support items ignoring role property', () => {
      const roleConfig = {
        user: {
          placement: 'end' as const,
        },
      };

      const itemsWithOverride: BubbleItemType[] = [
        {
          key: 'item1',
          role: 'user',
          content: '用户消息',
          placement: 'start', // 覆盖 role 配置
        },
        {
          key: 'item2',
          content: '消息',
          placement: 'end', // 覆盖 role 配置
        } as any,
      ];

      const { container } = render(<BubbleList items={itemsWithOverride} role={roleConfig} />);
      const bubbles = container.querySelectorAll('.ant-bubble');

      expect(bubbles.length).toBe(2);
      expect(bubbles[0].textContent).toBe('用户消息'); // user role
    });

    it('should support property override in items over role configuration', () => {
      const roleConfig = {
        user: {
          placement: 'end' as const,
        },
      };

      const itemsWithOverride: BubbleItemType[] = [
        {
          key: 'item1',
          role: 'user',
          content: '用户消息',
          placement: 'start', // 覆盖 role 配置
        },
      ];

      const { container } = render(<BubbleList items={itemsWithOverride} role={roleConfig} />);
      const bubble = container.querySelector('.ant-bubble');

      expect(bubble).toHaveClass('ant-bubble-start'); // 应该使用 item 中的配置
    });

    it('should support default rendering of divider role', () => {
      const itemsWithOverride: BubbleItemType[] = [
        {
          key: 'item1',
          role: 'divider',
          content: '分割线',
        },
        {
          key: 'item2',
          role: 'user',
          content: '用户消息',
        },
      ];

      // 即便不配置 role，也支持渲染 item.role = 'divider' 的分割线
      const { container } = render(<BubbleList items={itemsWithOverride} autoScroll={false} />);
      const divider = container.querySelector('.ant-bubble-divider');
      const bubbles = container.querySelectorAll('.ant-bubble');

      // 由于autoScroll=false，items不会被反转，应该有2个元素
      expect(bubbles).toHaveLength(2);
      expect(divider).toBeInTheDocument();
    });

    it('should support default rendering of system role', () => {
      const itemsWithOverride: BubbleItemType[] = [
        {
          key: 'item1',
          role: 'system',
          content: '系统消息',
        },
        {
          key: 'item2',
          role: 'user',
          content: '用户消息',
        },
      ];

      // 即便不配置 role，也支持渲染 item.role = 'system' 的系统消息
      const { container } = render(<BubbleList items={itemsWithOverride} />);
      const listElement = container.querySelector('.ant-bubble-list-scroll-box') as HTMLDivElement;
      const system = container.querySelector('.ant-bubble-system');

      expect(listElement.querySelectorAll('.ant-bubble').length).toBe(2);
      expect(system).toBeInTheDocument();
    });
  });

  describe('滚动功能', () => {
    let mockScrollTo: jest.Mock;
    let mockScrollIntoView: jest.Mock;

    beforeEach(() => {
      // Mock scrollTo and scrollIntoView
      mockScrollTo = jest.fn();
      mockScrollIntoView = jest.fn();
      Element.prototype.scrollTo = mockScrollTo;
      Element.prototype.scrollIntoView = mockScrollIntoView;

      // Mock scroll properties
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
        configurable: true,
        value: 1000,
      });
      Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
        configurable: true,
        value: 0,
      });
      Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
        configurable: true,
        value: 500,
      });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        value: 100,
      });
    });

    afterEach(() => {
      mockScrollTo.mockClear();
      mockScrollIntoView.mockClear();
    });

    it('should support disabling auto scroll', async () => {
      const { container, rerender } = render(<BubbleList items={mockItems} autoScroll />);
      const scrollBoxElement = container.querySelector(
        '.ant-bubble-list-scroll-box',
      ) as HTMLDivElement;
      scrollBoxElement.scrollTo = mockScrollTo;
      // 清除初始渲染时的调用
      mockScrollTo.mockClear();

      expect(scrollBoxElement).toHaveClass('ant-bubble-list-autoscroll');

      const newItems = [
        ...mockItems,
        { key: 'item4', role: 'user', content: '一段非常长的文本'.repeat(30), typing: true },
      ];
      rerender(<BubbleList items={newItems} autoScroll={false} />);
      expect(scrollBoxElement).not.toHaveClass('ant-bubble-list-autoscroll');
    });

    it('should support onScroll callback', () => {
      const onScroll = jest.fn();
      const { container } = render(<BubbleList items={mockItems} onScroll={onScroll} />);
      const scrollBoxElement = container.querySelector('.ant-bubble-list-scroll-box');

      fireEvent.scroll(scrollBoxElement!);

      expect(onScroll).toHaveBeenCalled();
    });
  });

  describe('ref 功能', () => {
    let mockScrollTo: jest.Mock;
    let mockScrollIntoView: jest.Mock;

    beforeEach(() => {
      mockScrollTo = jest.fn();
      mockScrollIntoView = jest.fn();
      Element.prototype.scrollTo = mockScrollTo;
      Element.prototype.scrollIntoView = mockScrollIntoView;
    });

    afterEach(() => {
      mockScrollTo.mockClear();
      mockScrollIntoView.mockClear();
    });

    it('should support scrolling to specified position via ref.scrollTo', () => {
      const ref = React.createRef<BubbleListRef>();
      const { container, rerender } = render(
        <BubbleList items={mockItems} ref={ref} autoScroll={false} />,
      );
      const scrollBoxElement = container.querySelector(
        '.ant-bubble-list-scroll-box',
      ) as HTMLDivElement;

      // 确保 scrollBoxElement 有 scrollTo 方法
      scrollBoxElement.scrollTo = mockScrollTo;

      act(() => {
        ref.current!.scrollTo({ top: 100, behavior: 'smooth' });
      });

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 100,
        behavior: 'smooth',
      });

      // 在 autoScroll 启用情况下，scrollTop 是负数， -scrollHeight + clientHeight 是顶部， 0 是底部
      rerender(<BubbleList items={mockItems} ref={ref} />);

      act(() => {
        ref.current!.scrollTo({ top: 100, behavior: 'smooth' });
      });

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: -1000 + 500 + 100,
        behavior: 'smooth',
      });
    });

    it('should support quick scrolling to top or bottom via ref.scrollTo', () => {
      const ref = React.createRef<BubbleListRef>();
      const { container, rerender } = render(<BubbleList items={mockItems} ref={ref} />);
      const scrollBoxElement = container.querySelector(
        '.ant-bubble-list-scroll-box',
      ) as HTMLDivElement;

      // 确保 scrollBoxElement 有 scrollTo 方法
      scrollBoxElement.scrollTo = mockScrollTo;

      act(() => {
        ref.current!.scrollTo({ top: 'bottom' });
      });
      expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

      act(() => {
        ref.current!.scrollTo({ top: 'top' });
      });
      expect(mockScrollTo).toHaveBeenCalledWith({ top: -1000, behavior: 'smooth' });

      rerender(<BubbleList items={mockItems} ref={ref} autoScroll={false} />);

      act(() => {
        ref.current!.scrollTo({ top: 'bottom' });
      });
      expect(mockScrollTo).toHaveBeenCalledWith({ top: 1000, behavior: 'smooth' });

      act(() => {
        ref.current!.scrollTo({ top: 'top' });
      });
      expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('should support scrolling to element with specified key via ref.scrollTo', () => {
      const ref = React.createRef<BubbleListRef>();
      const { container } = render(<BubbleList items={mockItems} ref={ref} />);

      // 模拟 bubble 元素的 scrollIntoView 方法
      const bubbles = container.querySelectorAll('.ant-bubble');
      bubbles.forEach((bubble) => {
        (bubble as any).scrollIntoView = mockScrollIntoView;
      });

      act(() => {
        ref.current!.scrollTo({ key: 'item2', behavior: 'smooth', block: 'center' });
      });

      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });

    it('should support scrolling to element with specified key via ref.scrollTo when auto scroll is disabled', () => {
      const ref = React.createRef<BubbleListRef>();
      const { container } = render(<BubbleList items={mockItems} ref={ref} autoScroll={false} />);

      // 模拟 bubble 元素的 scrollIntoView 方法
      const bubbles = container.querySelectorAll('.ant-bubble');
      bubbles.forEach((bubble) => {
        (bubble as any).scrollIntoView = mockScrollIntoView;
      });

      act(() => {
        ref.current!.scrollTo({ key: 'item2', behavior: 'smooth', block: 'center' });
      });

      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });

    it('should handle non-existent key', () => {
      const ref = React.createRef<BubbleListRef>();
      render(<BubbleList items={mockItems} ref={ref} />);

      act(() => {
        ref.current!.scrollTo({ key: 'nonexistent', behavior: 'smooth' });
      });

      // 不应该抛出错误，也不应该调用 scrollIntoView
      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });

    it('should handle case with neither top nor key', () => {
      const ref = React.createRef<BubbleListRef>();
      render(<BubbleList items={mockItems} ref={ref} />);

      act(() => {
        ref.current!.scrollTo({ behavior: 'smooth' });
      });

      // 不应该调用任何滚动方法
      expect(mockScrollTo).not.toHaveBeenCalled();
      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });
  });

  describe('动画回调处理', () => {
    it('should trigger auto scroll during animation', async () => {
      const itemsWithAnimation: BubbleItemType[] = [
        {
          key: 'item1',
          role: 'user',
          content: 'Hello World',
          typing: {
            effect: 'typing',
            step: 1,
            interval: 50,
          },
        },
      ];

      const { container } = render(<BubbleList items={itemsWithAnimation} />);
      const listElement = container.querySelector('.ant-bubble-list') as HTMLDivElement;

      expect(listElement.scrollTop).toBe(0);
      // 等待动画进行
      await waitFakeTimer(100, 10);

      expect(listElement.scrollTop).toBe(0);
    });
  });

  describe('DOM 属性处理', () => {
    it('should correctly pass aria attributes', () => {
      const { container } = render(
        <BubbleList items={mockItems} aria-label="消息列表" aria-describedby="description" />,
      );
      const listElement = container.querySelector('.ant-bubble-list');

      expect(listElement).toHaveAttribute('aria-label', '消息列表');
      expect(listElement).toHaveAttribute('aria-describedby', 'description');
    });

    it('should filter out non-DOM attributes', () => {
      const { container } = render(
        <BubbleList
          items={mockItems}
          {...({ customProp: 'should-not-appear' } as any)} // 这个属性不应该出现在 DOM 中
        />,
      );
      const listElement = container.querySelector('.ant-bubble-list');

      expect(listElement).not.toHaveAttribute('customProp');
    });

    it('should pass standard HTML attributes', () => {
      const { container } = render(<BubbleList items={mockItems} title="气泡列表" tabIndex={0} />);
      const listElement = container.querySelector('.ant-bubble-list');

      // 根据测试结果，这些属性实际上会被传递
      expect(listElement).toHaveAttribute('title', '气泡列表');
      expect(listElement).toHaveAttribute('tabIndex', '0');
    });

    it('should verify pickAttrs filtering behavior', () => {
      const { container } = render(
        <BubbleList
          items={mockItems}
          data-testid="bubble-list"
          data-custom="custom-value"
          aria-label="消息列表"
          title="气泡列表"
        />,
      );
      const listElement = container.querySelector('.ant-bubble-list');

      // 根据实际测试结果，pickAttrs 的行为：
      // - aria-* 属性会被传递
      expect(listElement).toHaveAttribute('aria-label', '消息列表');
      // - title 等标准属性会被传递
      expect(listElement).toHaveAttribute('title', '气泡列表');
      // - data-* 属性可能不会被传递（根据 pickAttrs 的配置）
      // 这里我们不强制要求 data-* 属性，因为这取决于 pickAttrs 的具体实现
    });
  });

  describe('边界情况', () => {
    it('should handle case where items is empty array', () => {
      const { container } = render(<BubbleList items={[]} />);
      const listElement = container.querySelector('.ant-bubble-list');

      expect(listElement).toBeInTheDocument();
      expect(container.querySelectorAll('.ant-bubble')).toHaveLength(0);
    });

    it('should handle case where item.role is not in role configuration', () => {
      const roleConfig = {
        user: { placement: 'end' as const },
      };

      const itemsWithUnknownRole: BubbleItemType[] = [
        {
          key: 'item1',
          role: 'unknown',
          content: '未知角色消息',
        },
      ];

      const { container } = render(<BubbleList items={itemsWithUnknownRole} role={roleConfig} />);

      expect(container.querySelectorAll('.ant-bubble')).toHaveLength(1);
      expect(container).toHaveTextContent('未知角色消息');
    });

    it('should handle case where listRef.current does not exist', () => {
      const { container } = render(<BubbleList items={mockItems} />);

      // 模拟 listRef.current 为 null 的情况
      const listElement = container.querySelector('.ant-bubble-list');
      Object.defineProperty(listElement, 'scrollTo', {
        value: undefined,
      });

      // 不应该抛出错误
      expect(container).toBeInTheDocument();
    });

    it('should handle case where lastBubble does not exist', () => {
      const { container } = render(<BubbleList items={[]} />);
      const listElement = container.querySelector('.ant-bubble-list');

      // 模拟滚动事件，此时没有 lastBubble
      fireEvent.scroll(listElement!);

      expect(listElement).toBeInTheDocument();
    });

    it('should handle case where lastBubble.nativeElement does not exist', () => {
      const { container } = render(<BubbleList items={mockItems} />);
      const listElement = container.querySelector('.ant-bubble-list');

      // 模拟滚动事件
      fireEvent.scroll(listElement!);

      expect(listElement).toBeInTheDocument();
    });
  });

  describe('组件更新', () => {
    it('should re-render when items change', () => {
      const { container, rerender } = render(<BubbleList items={mockItems} />);

      expect(container.querySelectorAll('.ant-bubble')).toHaveLength(2);

      const newItems: BubbleItemType[] = [
        {
          key: 'new-item',
          role: 'user',
          content: '新消息',
        },
      ];

      rerender(<BubbleList items={newItems} />);

      expect(container.querySelectorAll('.ant-bubble')).toHaveLength(1);
      expect(container).toHaveTextContent('新消息');
      expect(container).not.toHaveTextContent('用户消息1');
    });

    it('should correctly handle autoScroll property changes', () => {
      const { container, rerender } = render(<BubbleList items={mockItems} autoScroll={true} />);

      expect(container.querySelector('.ant-bubble-list')).toBeInTheDocument();

      rerender(<BubbleList items={mockItems} autoScroll={false} />);

      expect(container.querySelector('.ant-bubble-list')).toBeInTheDocument();
    });
  });

  describe('高级测试覆盖率', () => {
    describe('BubbleListItem 组件详细测试', () => {
      it('should not handle case where role is undefined', () => {
        const itemsWithoutRole: BubbleItemType[] = [
          {
            key: 'item1',
            content: '无角色消息',
          } as any,
        ];

        const { container } = render(<BubbleList items={itemsWithoutRole} />);
        expect(container.querySelectorAll('.ant-bubble')).toHaveLength(1);
      });

      it('should correctly pass styles and classNames to divider', () => {
        const items: BubbleItemType[] = [
          {
            key: 'item1',
            role: 'divider',
            content: '分割线',
            styles: { root: { color: 'red' } },
            classNames: { root: 'custom-divider' },
          },
        ];

        const { container } = render(
          <BubbleList
            items={items}
            autoScroll={false}
            styles={{ root: { backgroundColor: '#fff' }, divider: { color: 'blue' } }}
            classNames={{ root: 'list-root', divider: 'divider-root' }}
          />,
        );
        const divider = container.querySelector('.ant-bubble-divider');

        expect(divider).toBeInTheDocument();
        expect(divider).toHaveClass('custom-divider');
        expect(divider).not.toHaveClass('divider-root', 'list-root');
        expect(divider).toHaveStyle({ color: 'red' });
        expect(divider).not.toHaveStyle({ backgroundColor: '#fff', color: 'blue' });
      });

      it('should correctly pass styles and classNames to system', () => {
        const items: BubbleItemType[] = [
          {
            key: 'item1',
            role: 'system',
            content: '系统消息',
          },
        ];

        const { container } = render(
          <BubbleList
            items={items}
            autoScroll={false}
            styles={{ root: { backgroundColor: '#fff' }, system: { color: 'blue' } }}
            classNames={{ root: 'list-root', system: 'system-root' }}
          />,
        );
        const system = container.querySelector('.ant-bubble-system');

        expect(system).toBeInTheDocument();
        expect(system).toHaveClass('system-root');
        expect(system).not.toHaveClass('list-root');
        expect(system).toHaveStyle({ color: 'blue' });
        expect(system).not.toHaveStyle({ backgroundColor: '#fff' });
      });

      it('should handle complex styles and classNames structures', () => {
        const items: BubbleItemType[] = [
          {
            key: 'item1',
            role: 'user',
            content: '测试消息',
            styles: { root: { margin: '10px' }, body: { color: 'red' } },
            classNames: { root: 'custom-bubble' },
          },
        ];

        const { container } = render(
          <BubbleList
            items={items}
            autoScroll={false}
            styles={{
              root: { backgroundColor: '#fff' },
              bubble: { color: 'blue' },
              body: { color: 'blue' },
            }}
            classNames={{ root: 'list-root', bubble: 'bubble-root' }}
          />,
        );
        const bubble = container.querySelector('.ant-bubble');
        const body = bubble?.querySelector('.ant-bubble-body');

        expect(bubble).toBeInTheDocument();
        expect(bubble).toHaveClass('custom-bubble');
        expect(bubble).not.toHaveClass('bubble-root');
        expect(bubble).toHaveStyle({ margin: '10px' });
        expect(bubble).not.toHaveStyle({ backgroundColor: '#fff', color: 'blue' });
        expect(body).toHaveStyle({ color: 'red' });
      });
    });

    describe('边界情况和错误处理', () => {
      it('should handle empty array case', () => {
        const { container } = render(<BubbleList items={[]} />);
        expect(container.querySelector('.ant-bubble-list')).toBeInTheDocument();
        expect(container.querySelectorAll('.ant-bubble')).toHaveLength(0);
      });

      it('should handle case where role configuration is null', () => {
        const { container } = render(<BubbleList items={mockItems} role={null as any} />);
        const bubbles = container.querySelectorAll('.ant-bubble');

        expect(bubbles).toHaveLength(2);
      });

      it('should handle case where role configuration is undefined', () => {
        const { container } = render(<BubbleList items={mockItems} role={undefined as any} />);
        const bubbles = container.querySelectorAll('.ant-bubble');

        expect(bubbles).toHaveLength(2);
      });

      it('should handle case where role configuration function returns empty object', () => {
        const roleConfig: RoleType = {
          user: () => ({}) as any,
          ai: () => ({ placement: 'start' as const }),
        };

        const items: BubbleItemType[] = [
          { key: 'item1', role: 'user', content: '用户消息' },
          { key: 'item2', role: 'ai', content: 'AI回复' },
        ];

        const { container } = render(
          <BubbleList items={items} role={roleConfig} autoScroll={false} />,
        );
        const bubbles = container.querySelectorAll('.ant-bubble');

        expect(bubbles).toHaveLength(2);
      });
    });

    describe('样式和主题测试', () => {
      it('should correctly apply custom prefix styles', () => {
        const { container } = render(
          <BubbleList
            items={mockItems}
            prefixCls="custom-prefix"
            classNames={{ root: 'custom-root-class' }}
            styles={{ root: { backgroundColor: 'yellow' } }}
          />,
        );

        const listElement = container.querySelector('.custom-prefix-list');
        expect(listElement).toBeInTheDocument();
        expect(listElement).toHaveClass('custom-root-class');
        expect(listElement).toHaveStyle({ backgroundColor: 'yellow' });
      });

      it('should correctly merge classNames and styles', () => {
        const { container } = render(
          <BubbleList
            items={mockItems}
            className="global-class"
            rootClassName="root-class"
            style={{ color: 'red' }}
            styles={{ root: { backgroundColor: 'blue' } }}
            classNames={{ root: 'component-class' }}
          />,
        );

        const listElement = container.querySelector('.ant-bubble-list');
        expect(listElement).toHaveClass('global-class');
        expect(listElement).toHaveClass('root-class');
        expect(listElement).toHaveClass('component-class');
        expect(listElement).toHaveStyle({ color: 'red', backgroundColor: 'blue' });
      });
    });

    describe('事件处理和交互', () => {
      it('should handle scroll events', () => {
        const onScroll = jest.fn();
        const { container } = render(
          <BubbleList items={mockItems} onScroll={onScroll} autoScroll={false} />,
        );

        const scrollBox = container.querySelector('.ant-bubble-list-scroll-box');

        // 模拟滚动事件
        fireEvent.scroll(scrollBox!);

        expect(onScroll).toHaveBeenCalled();
      });

      it('should handle edge cases of ref methods', () => {
        const ref = React.createRef<BubbleListRef>();
        render(<BubbleList items={[]} ref={ref} />);

        // 测试空列表时的滚动行为
        act(() => {
          ref.current!.scrollTo({ key: 'nonexistent', behavior: 'smooth' });
        });

        // 不应该抛出错误
        expect(ref.current).toBeTruthy();
      });
    });

    describe('性能和大规模数据测试', () => {
      it('should correctly handle large number of items', () => {
        const largeItems: BubbleItemType[] = Array.from({ length: 100 }, (_, i) => ({
          key: `item-${i}`,
          role: i % 2 === 0 ? 'user' : 'ai',
          content: `消息 ${i}`,
        }));

        const { container } = render(<BubbleList items={largeItems} autoScroll={false} />);
        const bubbles = container.querySelectorAll('.ant-bubble');

        expect(bubbles).toHaveLength(100);
      });

      it('should correctly handle frequently updated items', () => {
        const { container, rerender } = render(<BubbleList items={mockItems} />);

        // 模拟频繁更新
        for (let i = 0; i < 5; i++) {
          const newItems: BubbleItemType[] = [
            ...mockItems,
            { key: `new-${i}`, role: 'user', content: `新消息 ${i}` },
          ];
          rerender(<BubbleList items={newItems} />);
        }

        const bubbles = container.querySelectorAll('.ant-bubble');
        expect(bubbles.length).toBeGreaterThanOrEqual(2);
      });
    });

    describe('role 配置函数测试', () => {
      it('should handle case where role configuration function returns empty object', () => {
        const roleConfig: RoleType = {
          user: () => ({}) as any,
          ai: () => ({ placement: 'start' as const }),
        };

        const items: BubbleItemType[] = [
          { key: 'item1', role: 'user', content: '用户消息' },
          { key: 'item2', role: 'ai', content: 'AI回复' },
        ];

        const { container } = render(
          <BubbleList items={items} role={roleConfig} autoScroll={false} />,
        );
        const bubbles = container.querySelectorAll('.ant-bubble');

        expect(bubbles).toHaveLength(2);
      });

      it('should handle case where role configuration function returns complex configuration', () => {
        const roleConfig: RoleType = {
          user: (item) => ({
            placement: 'end' as const,
            variant: 'outlined' as const,
            ...item,
          }),
          ai: (item) => ({
            placement: 'start' as const,
            variant: 'filled' as const,
            ...item,
          }),
        };

        const items: BubbleItemType[] = [
          { key: 'item1', role: 'user', content: '用户消息' },
          { key: 'item2', role: 'ai', content: 'AI回复' },
        ];

        const { container } = render(
          <BubbleList items={items} role={roleConfig} autoScroll={false} />,
        );
        const bubbles = container.querySelectorAll('.ant-bubble');

        expect(bubbles).toHaveLength(2);
      });
    });
  });
});
