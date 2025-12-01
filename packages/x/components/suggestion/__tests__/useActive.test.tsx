import { renderHook } from '@testing-library/react';
import type { SuggestionItem } from '../index';
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
});
