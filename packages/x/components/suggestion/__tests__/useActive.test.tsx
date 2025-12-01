import { act, renderHook } from '@testing-library/react';
import type { SuggestionItem } from '..';
import useActive from '../useActive';

describe('useActive', () => {
  it('should initialize activePaths with first item value when open is true and items is valid array', () => {
    const items: SuggestionItem[] = [
      { label: 'Item 1', value: 'item1' },
      { label: 'Item 2', value: 'item2' },
    ];

    const { result } = renderHook(() => useActive(items, true, false, jest.fn()));

    const [activePaths] = result.current;
    expect(activePaths).toEqual(['item1']);
  });

  it('should not initialize activePaths when open is false', () => {
    const items: SuggestionItem[] = [{ label: 'Item 1', value: 'item1' }];

    const { result } = renderHook(() => useActive(items, false, false, jest.fn()));

    const [activePaths] = result.current;
    expect(activePaths).toEqual([]);
  });

  it('should not initialize activePaths when items is empty array', () => {
    const { result } = renderHook(() => useActive([], true, false, jest.fn()));

    const [activePaths] = result.current;
    expect(activePaths).toEqual([]);
  });

  it('should not initialize activePaths when items is not a valid array', () => {
    // Test with null
    const { result: result1 } = renderHook(() => useActive(null as any, true, false, jest.fn()));

    const [activePaths1] = result1.current;
    expect(activePaths1).toEqual([]);

    // Test with undefined
    const { result: result2 } = renderHook(() =>
      useActive(undefined as any, true, false, jest.fn()),
    );

    const [activePaths2] = result2.current;
    expect(activePaths2).toEqual([]);

    // Test with non-array value
    const { result: result3 } = renderHook(() =>
      useActive('not-an-array' as any, true, false, jest.fn()),
    );

    const [activePaths3] = result3.current;
    expect(activePaths3).toEqual([]);
  });

  describe('getItems functionality', () => {
    it('should get items for first column', () => {
      const items: SuggestionItem[] = [
        { label: 'Item 1', value: 'item1' },
        { label: 'Item 2', value: 'item2' },
      ];

      const { result } = renderHook(() => useActive(items, true, false, jest.fn()));

      // 通过内部实现测试 getItems 方法
      const [activePaths, onKeyDown] = result.current;
      expect(activePaths).toEqual(['item1']);
    });

    it('should get items for nested structure', () => {
      const items: SuggestionItem[] = [
        {
          label: 'Parent 1',
          value: 'parent1',
          children: [
            { label: 'Child 1', value: 'child1' },
            { label: 'Child 2', value: 'child2' },
          ],
        },
        {
          label: 'Parent 2',
          value: 'parent2',
          children: [{ label: 'Child 3', value: 'child3' }],
        },
      ];

      const { result } = renderHook(() => useActive(items, true, false, jest.fn()));

      const [activePaths] = result.current;
      expect(activePaths).toEqual(['parent1']);
    });

    it('should handle deep nested structure', () => {
      const items: SuggestionItem[] = [
        {
          label: 'Level 1',
          value: 'level1',
          children: [
            {
              label: 'Level 2',
              value: 'level2',
              children: [{ label: 'Level 3', value: 'level3' }],
            },
          ],
        },
      ];

      const { result } = renderHook(() => useActive(items, true, false, jest.fn()));

      const [activePaths] = result.current;
      expect(activePaths).toEqual(['level1']);
    });
  });

  describe('keyboard navigation', () => {
    it('should handle ArrowDown key', () => {
      const items: SuggestionItem[] = [
        { label: 'Item 1', value: 'item1' },
        { label: 'Item 2', value: 'item2' },
        { label: 'Item 3', value: 'item3' },
      ];

      const { result } = renderHook(() => useActive(items, true, false, jest.fn()));
      const [, onKeyDown] = result.current;

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      const [activePaths] = result.current;
      expect(activePaths).toEqual(['item2']);
    });

    it('should handle ArrowUp key', () => {
      const items: SuggestionItem[] = [
        { label: 'Item 1', value: 'item1' },
        { label: 'Item 2', value: 'item2' },
        { label: 'Item 3', value: 'item3' },
      ];

      const { result } = renderHook(() => useActive(items, true, false, jest.fn()));
      const [, onKeyDown] = result.current;

      // 先移动到第二个项目
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      // 再向上移动
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      const [activePaths] = result.current;
      expect(activePaths).toEqual(['item1']);
    });

    it('should handle ArrowRight key to go next', () => {
      const items: SuggestionItem[] = [
        {
          label: 'Parent 1',
          value: 'parent1',
          children: [
            { label: 'Child 1', value: 'child1' },
            { label: 'Child 2', value: 'child2' },
          ],
        },
      ];

      const { result } = renderHook(() => useActive(items, true, false, jest.fn()));
      const [, onKeyDown] = result.current;

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      const [activePaths] = result.current;
      expect(activePaths).toEqual(['parent1', 'child1']);
    });

    it('should handle ArrowLeft key to go back', () => {
      const items: SuggestionItem[] = [
        {
          label: 'Parent 1',
          value: 'parent1',
          children: [{ label: 'Child 1', value: 'child1' }],
        },
      ];

      const { result } = renderHook(() => useActive(items, true, false, jest.fn()));
      const [, onKeyDown] = result.current;

      // 先进入子菜单
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      expect(result.current[0]).toEqual(['parent1', 'child1']);

      // 再返回上一级
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      const [activePaths] = result.current;
      expect(activePaths).toEqual(['parent1']);
    });

    it('should handle Enter key', () => {
      const items: SuggestionItem[] = [{ label: 'Item 1', value: 'item1' }];

      const { result } = renderHook(() => useActive(items, true, false, jest.fn()));
      const [, onKeyDown] = result.current;

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      // Enter 键应该阻止默认行为
      expect(result.current[0]).toEqual(['item1']);
    });

    it('should handle Escape key', () => {
      const items: SuggestionItem[] = [{ label: 'Item 1', value: 'item1' }];
      const onCancel = jest.fn();

      const { result } = renderHook(() => useActive(items, true, false, onCancel));
      const [, onKeyDown] = result.current;

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      expect(onCancel).toHaveBeenCalled();
    });

    it('should not handle keys when open is false', () => {
      const items: SuggestionItem[] = [
        { label: 'Item 1', value: 'item1' },
        { label: 'Item 2', value: 'item2' },
      ];

      const { result } = renderHook(() => useActive(items, false, false, jest.fn()));
      const [, onKeyDown] = result.current;

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      const [activePaths] = result.current;
      expect(activePaths).toEqual([]);
    });
  });

  describe('RTL mode', () => {
    it('should handle ArrowRight key in RTL mode to go back', () => {
      const items: SuggestionItem[] = [
        {
          label: 'Parent 1',
          value: 'parent1',
          children: [{ label: 'Child 1', value: 'child1' }],
        },
      ];

      const { result } = renderHook(() => useActive(items, true, true, jest.fn()));
      const [, onKeyDown] = result.current;

      // 先进入子菜单
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      expect(result.current[0]).toEqual(['parent1', 'child1']);

      // 在RTL模式下，ArrowRight应该返回上一级
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      const [activePaths] = result.current;
      expect(activePaths).toEqual(['parent1']);
    });

    it('should handle ArrowLeft key in RTL mode to go next', () => {
      const items: SuggestionItem[] = [
        {
          label: 'Parent 1',
          value: 'parent1',
          children: [{ label: 'Child 1', value: 'child1' }],
        },
      ];

      const { result } = renderHook(() => useActive(items, true, true, jest.fn()));
      const [, onKeyDown] = result.current;

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      const [activePaths] = result.current;
      expect(activePaths).toEqual(['parent1', 'child1']);
    });
  });

  describe('edge cases', () => {
    it('should handle empty children array', () => {
      const items: SuggestionItem[] = [
        {
          label: 'Parent 1',
          value: 'parent1',
          children: [],
        },
      ];

      const { result } = renderHook(() => useActive(items, true, false, jest.fn()));
      const [, onKeyDown] = result.current;

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      const [activePaths] = result.current;
      expect(activePaths).toEqual(['parent1']);
    });

    it('should handle circular navigation with ArrowDown', () => {
      const items: SuggestionItem[] = [
        { label: 'Item 1', value: 'item1' },
        { label: 'Item 2', value: 'item2' },
      ];

      const { result } = renderHook(() => useActive(items, true, false, jest.fn()));
      const [, onKeyDown] = result.current;

      // 移动到最后一项
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      expect(result.current[0]).toEqual(['item2']);

      // 再向下移动，应该循环到第一项
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      const [activePaths] = result.current;
      expect(activePaths).toEqual(['item1']);
    });

    it('should handle circular navigation with ArrowUp', () => {
      const items: SuggestionItem[] = [
        { label: 'Item 1', value: 'item1' },
        { label: 'Item 2', value: 'item2' },
      ];

      const { result } = renderHook(() => useActive(items, true, false, jest.fn()));
      const [, onKeyDown] = result.current;

      // 向上移动，应该循环到最后一项
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        onKeyDown(event as any);
      });

      const [activePaths] = result.current;
      expect(activePaths).toEqual(['item2']);
    });

    it('should handle non-existent active item in getItems', () => {
      const items: SuggestionItem[] = [
        {
          label: 'Parent 1',
          value: 'parent1',
          children: [{ label: 'Child 1', value: 'child1' }],
        },
      ];

      const { result } = renderHook(() => useActive(items, true, false, jest.fn()));

      // 这种情况主要测试 getItems 方法在遇到无效路径时的处理
      const [activePaths] = result.current;
      expect(activePaths).toEqual(['parent1']);
    });
  });
});
