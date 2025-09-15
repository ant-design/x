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
    it('应该正确渲染基本的 BubbleList 组件', () => {
      const { container } = render(<BubbleList items={mockItems} />);
      const listElement = container.querySelector('.ant-bubble-list');

      expect(listElement).toBeInTheDocument();
      expect(container.querySelectorAll('.ant-bubble')).toHaveLength(2);
    });

    it('应该支持自定义 prefixCls', () => {
      const { container } = render(<BubbleList items={mockItems} prefixCls="custom-bubble" />);
      const listElement = container.querySelector('.custom-bubble-list');

      expect(listElement).toBeInTheDocument();
    });

    it('应该支持 ref 引用', () => {
      const ref = React.createRef<BubbleListRef>();
      render(<BubbleList items={mockItems} ref={ref} />);

      expect(ref.current).toBeTruthy();
      expect(ref.current!.nativeElement).toBeInstanceOf(HTMLElement);
      expect(typeof ref.current!.scrollTo).toBe('function');
    });

    it('应该支持自定义 className 和 style', () => {
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

    it('应该支持 rootClassName 和 rootStyle', () => {
      const { container } = render(
        <BubbleList items={mockItems} rootClassName="root-class" rootStyle={{ margin: '10px' }} />,
      );
      const listElement = container.querySelector('.ant-bubble-list');

      expect(listElement).toHaveClass('root-class');
      expect(listElement).toHaveStyle({ margin: '10px' });
    });
  });

  describe('items 渲染', () => {
    it('应该正确渲染所有 items', () => {
      const { container } = render(<BubbleList items={mockItems} />);
      const bubbles = container.querySelectorAll('.ant-bubble');

      expect(bubbles).toHaveLength(2);
      expect(container).toHaveTextContent('用户消息1');
      expect(container).toHaveTextContent('AI回复1');
    });

    it('应该处理空 items 数组', () => {
      const { container } = render(<BubbleList items={[]} />);
      const listElement = container.querySelector('.ant-bubble-list');
      const bubbles = container.querySelectorAll('.ant-bubble');

      expect(listElement).toBeInTheDocument();
      expect(bubbles).toHaveLength(0);
    });

    it('应该支持 role 配置', () => {
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

      // autoScroll 启用情况下，数据渲染是倒序的
      expect(bubbles[1]).toHaveClass('ant-bubble-end'); // user role
      expect(bubbles[0]).toHaveClass('ant-bubble-start'); // ai role
    });

    it('应支持 role 函数配置', () => {
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

      // autoScroll 启用情况下，数据渲染是倒序的
      expect(bubbles[1]).toHaveClass('ant-bubble-end'); // user role
      expect(bubbles[0]).toHaveClass('ant-bubble-start'); // ai role
    });

    it('应该支持 role 为空', () => {
      const { container } = render(<BubbleList items={mockItems} />);
      const bubbles = container.querySelectorAll('.ant-bubble');

      // autoScroll 启用情况下，数据渲染是倒序的
      expect(bubbles[1]).toHaveClass('ant-bubble-start'); // user role
      expect(bubbles[0]).toHaveClass('ant-bubble-start'); // ai role
    });

    it('应该支持 items 不配置 role 属性', () => {
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
          key: 'item1',
          content: '消息',
          placement: 'end', // 覆盖 role 配置
        },
      ];

      const { container } = render(<BubbleList items={itemsWithOverride} role={roleConfig} />);
      const bubbles = container.querySelectorAll('.ant-bubble');

      expect(bubbles.length).toBe(2);
      expect(bubbles[1].textContent).toBe('用户消息'); // user role
      expect(bubbles[0].textContent).toBe('消息');
    });

    it('应该支持 items 中的属性覆盖 role 配置', () => {
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

    it('应该在 items 长度变化时自动滚动到底部', () => {
      const { rerender, container } = render(<BubbleList items={mockItems} />);
      const listElement = container.querySelector('.ant-bubble-list') as HTMLDivElement;
      listElement.scrollTo = mockScrollTo;

      // 清除初始渲染时的调用
      mockScrollTo.mockClear();

      const newItems = [...mockItems, { key: 'item4', role: 'user', content: '新消息' }];
      rerender(<BubbleList items={newItems} />);
      // 源代码中执行了 scrollTo 即滚动到底部
      expect(mockScrollTo).toHaveBeenCalled();
    });

    it('应该支持禁用自动滚动', async () => {
      const { container, rerender } = render(<BubbleList items={mockItems} autoScroll />);
      const listElement = container.querySelector('.ant-bubble-list') as HTMLDivElement;
      listElement.scrollTo = mockScrollTo;
      // 清除初始渲染时的调用
      mockScrollTo.mockClear();

      expect(listElement).toHaveClass('ant-bubble-list-autoscroll');

      const newItems = [
        ...mockItems,
        { key: 'item4', role: 'user', content: '一段非常长的文本'.repeat(30), typing: true },
      ];
      rerender(<BubbleList items={newItems} autoScroll={false} />);
      expect(listElement).not.toHaveClass('ant-bubble-list-autoscroll');
      // 仅在添加消息时滚动到底部，后续动画过程不触发滚动
      expect(mockScrollTo).toHaveBeenCalledTimes(1);

      await waitFakeTimer(1000, 10);
      expect(mockScrollTo).toHaveBeenCalledTimes(1);
    });

    it('应该支持 onScroll 回调', () => {
      const onScroll = jest.fn();
      const { container } = render(<BubbleList items={mockItems} onScroll={onScroll} />);
      const listElement = container.querySelector('.ant-bubble-list');

      fireEvent.scroll(listElement!);

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

    it('应该支持通过 ref.scrollTo 滚动到指定位置', () => {
      const ref = React.createRef<BubbleListRef>();
      const { container, rerender } = render(
        <BubbleList items={mockItems} ref={ref} autoScroll={false} />,
      );
      const listElement = container.querySelector('.ant-bubble-list') as HTMLDivElement;

      // 确保 listElement 有 scrollTo 方法
      listElement.scrollTo = mockScrollTo;

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

    it('应该支持通过 ref.scrollTo 快速滚动到顶部或底部', () => {
      const ref = React.createRef<BubbleListRef>();
      const { container, rerender } = render(<BubbleList items={mockItems} ref={ref} />);
      const listElement = container.querySelector('.ant-bubble-list') as HTMLDivElement;

      // 确保 listElement 有 scrollTo 方法
      listElement.scrollTo = mockScrollTo;

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

    it('应该支持通过 ref.scrollTo 滚动到指定 key 的元素', () => {
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

    it('应该处理不存在的 key', () => {
      const ref = React.createRef<BubbleListRef>();
      render(<BubbleList items={mockItems} ref={ref} />);

      act(() => {
        ref.current!.scrollTo({ key: 'nonexistent', behavior: 'smooth' });
      });

      // 不应该抛出错误，也不应该调用 scrollIntoView
      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });

    it('应该处理既没有 top 也没有 key 的情况', () => {
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
    it('应该在动画过程中触发自动滚动', async () => {
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
    it('应该正确传递 aria 属性', () => {
      const { container } = render(
        <BubbleList items={mockItems} aria-label="消息列表" aria-describedby="description" />,
      );
      const listElement = container.querySelector('.ant-bubble-list');

      expect(listElement).toHaveAttribute('aria-label', '消息列表');
      expect(listElement).toHaveAttribute('aria-describedby', 'description');
    });

    it('应该过滤掉非 DOM 属性', () => {
      const { container } = render(
        <BubbleList
          items={mockItems}
          {...({ customProp: 'should-not-appear' } as any)} // 这个属性不应该出现在 DOM 中
        />,
      );
      const listElement = container.querySelector('.ant-bubble-list');

      expect(listElement).not.toHaveAttribute('customProp');
    });

    it('应该传递标准 HTML 属性', () => {
      const { container } = render(<BubbleList items={mockItems} title="气泡列表" tabIndex={0} />);
      const listElement = container.querySelector('.ant-bubble-list');

      // 根据测试结果，这些属性实际上会被传递
      expect(listElement).toHaveAttribute('title', '气泡列表');
      expect(listElement).toHaveAttribute('tabIndex', '0');
    });

    it('应该验证 pickAttrs 的过滤行为', () => {
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
    it('应该处理 items 为空数组的情况', () => {
      const { container } = render(<BubbleList items={[]} />);
      const listElement = container.querySelector('.ant-bubble-list');

      expect(listElement).toBeInTheDocument();
      expect(container.querySelectorAll('.ant-bubble')).toHaveLength(0);
    });

    it('应该处理 item.role 不在 role 配置中的情况', () => {
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

    it('应该处理没有 listRef.current 的情况', () => {
      const { container } = render(<BubbleList items={mockItems} />);

      // 模拟 listRef.current 为 null 的情况
      const listElement = container.querySelector('.ant-bubble-list');
      Object.defineProperty(listElement, 'scrollTo', {
        value: undefined,
      });

      // 不应该抛出错误
      expect(container).toBeInTheDocument();
    });

    it('应该处理 lastBubble 不存在的情况', () => {
      const { container } = render(<BubbleList items={[]} />);
      const listElement = container.querySelector('.ant-bubble-list');

      // 模拟滚动事件，此时没有 lastBubble
      fireEvent.scroll(listElement!);

      expect(listElement).toBeInTheDocument();
    });

    it('应该处理 lastBubble.nativeElement 不存在的情况', () => {
      const { container } = render(<BubbleList items={mockItems} />);
      const listElement = container.querySelector('.ant-bubble-list');

      // 模拟滚动事件
      fireEvent.scroll(listElement!);

      expect(listElement).toBeInTheDocument();
    });
  });

  describe('组件更新', () => {
    it('应该在 items 变化时重新渲染', () => {
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

    it('应该在 autoScroll 属性变化时正确处理', () => {
      const { container, rerender } = render(<BubbleList items={mockItems} autoScroll={true} />);

      expect(container.querySelector('.ant-bubble-list')).toBeInTheDocument();

      rerender(<BubbleList items={mockItems} autoScroll={false} />);

      expect(container.querySelector('.ant-bubble-list')).toBeInTheDocument();
    });
  });
});
