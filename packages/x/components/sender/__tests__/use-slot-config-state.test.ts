import { act, renderHook } from '@testing-library/react';
import useSlotConfigState from '../hooks/use-slot-config-state';
import type { SlotConfigType } from '../interface';

const propTag = (key: string): SlotConfigType => ({
  type: 'tag',
  key,
  props: { value: key, label: `#${key}` },
});

const propInput = (key: string, defaultValue: string): SlotConfigType => ({
  type: 'input',
  key,
  props: { defaultValue, placeholder: 'input' },
});

describe('useSlotConfigState', () => {
  it('rebuilds map and slotValues from prop on first mount', () => {
    const initial = [propTag('a'), propInput('b', 'bv')];
    const { result } = renderHook(({ slotConfig }) => useSlotConfigState(slotConfig), {
      initialProps: { slotConfig: initial },
    });

    const [map, api] = result.current;
    expect(map.get('a')?.key).toBe('a');
    expect(map.get('b')?.key).toBe('b');
    expect(api.getSlotValues()).toEqual({ a: 'a', b: 'bv' });
  });

  it('keeps runtime-inserted entries when slotConfig prop reference changes (the bug)', () => {
    const { result, rerender } = renderHook(({ slotConfig }) => useSlotConfigState(slotConfig), {
      initialProps: { slotConfig: [] as SlotConfigType[] },
    });

    act(() => {
      result.current[1].mergeSlotConfig([propTag('runtime-1')]);
    });

    const [mapAfterInsert] = result.current;
    expect(mapAfterInsert.get('runtime-1')?.key).toBe('runtime-1');
    expect(result.current[1].getSlotValues()['runtime-1']).toBe('runtime-1');

    // Parent re-render with a fresh `[]` reference — must NOT wipe the runtime entry
    rerender({ slotConfig: [] });

    const [mapAfterRerender, apiAfterRerender] = result.current;
    expect(mapAfterRerender.get('runtime-1')?.key).toBe('runtime-1');
    expect(apiAfterRerender.getSlotValues()['runtime-1']).toBe('runtime-1');
  });

  it('removes prop-sourced entries that disappear from the new slotConfig', () => {
    const { result, rerender } = renderHook(({ slotConfig }) => useSlotConfigState(slotConfig), {
      initialProps: { slotConfig: [propTag('p1'), propTag('p2')] },
    });

    expect(result.current[0].get('p1')).toBeDefined();
    expect(result.current[0].get('p2')).toBeDefined();

    rerender({ slotConfig: [propTag('p1')] });

    expect(result.current[0].get('p1')).toBeDefined();
    expect(result.current[0].get('p2')).toBeUndefined();
    expect(result.current[1].getSlotValues()).toEqual({ p1: 'p1' });
  });

  it('clear() resets map, slotValues, and runtime-keys bookkeeping', () => {
    const { result, rerender } = renderHook(({ slotConfig }) => useSlotConfigState(slotConfig), {
      initialProps: { slotConfig: [propTag('p1')] },
    });

    act(() => {
      result.current[1].mergeSlotConfig([propTag('runtime-1')]);
    });
    expect(result.current[0].size).toBe(2);

    act(() => {
      result.current[1].clear();
    });
    expect(result.current[0].size).toBe(0);
    expect(result.current[1].getSlotValues()).toEqual({});

    // After clear, a parent re-render must not resurrect the previously-runtime key
    rerender({ slotConfig: [propTag('p1')] });
    expect(result.current[0].get('runtime-1')).toBeUndefined();
    expect(result.current[0].get('p1')).toBeDefined();
  });

  it('preserves runtime slotValues edits across prop reference changes', () => {
    const { result, rerender } = renderHook(({ slotConfig }) => useSlotConfigState(slotConfig), {
      initialProps: { slotConfig: [] as SlotConfigType[] },
    });

    act(() => {
      result.current[1].mergeSlotConfig([propInput('runtime-input', 'initial')]);
    });
    expect(result.current[1].getSlotValues()['runtime-input']).toBe('initial');

    act(() => {
      result.current[1].setSlotValues((prev) => ({ ...prev, 'runtime-input': 'user-typed' }));
    });
    expect(result.current[1].getSlotValues()['runtime-input']).toBe('user-typed');

    rerender({ slotConfig: [] });

    expect(result.current[1].getSlotValues()['runtime-input']).toBe('user-typed');
  });

  it('lets runtime entries survive a prop briefly declaring then removing the same key', () => {
    // Collision contract: runtime wins over a prop "drive-by". Pins the chosen semantics.
    const { result, rerender } = renderHook(({ slotConfig }) => useSlotConfigState(slotConfig), {
      initialProps: { slotConfig: [] as SlotConfigType[] },
    });

    act(() => {
      result.current[1].mergeSlotConfig([propTag('x')]);
    });
    expect(result.current[0].get('x')).toBeDefined();

    rerender({ slotConfig: [propTag('x')] });
    expect(result.current[0].get('x')).toBeDefined();

    rerender({ slotConfig: [] });
    expect(result.current[0].get('x')).toBeDefined();
  });
});
