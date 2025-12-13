import { act, renderHook } from '../../../tests/utils';
import useSyncState from '../useSyncState';

describe('useSyncState', () => {
  it('should initialize state with default value', () => {
    const { result } = renderHook(() => useSyncState(0));

    const [state] = result.current!;

    expect(state).toBe(0);
  });

  it('should initialize state with default value by getter', () => {
    const { result } = renderHook(() => useSyncState(() => 0));

    const [state] = result.current!;

    expect(state).toBe(0);
  });

  it('should update state using setState', () => {
    const { result } = renderHook(() => useSyncState(0));
    const [, setState] = result.current!;

    act(() => {
      setState(10);
    });

    const [state] = result.current!;
    expect(state).toBe(10);
  });

  it('should update state using setState by setter', () => {
    const { result } = renderHook(() => useSyncState(0));
    const [, setState] = result.current!;

    act(() => {
      setState((prev) => prev + 1);
    });

    const [state] = result.current!;
    expect(state).toBe(1);
  });

  it('should get the current state by getState', () => {
    const { result } = renderHook(() => useSyncState(0));
    const [, setState, getState] = result.current!;

    act(() => {
      setState(5);
    });

    expect(getState()).toBe(5);

    act(() => {
      setState((prev) => prev + 5);
    });

    expect(getState()).toBe(10);
  });

  it('should trigger re-renders when state update', () => {
    const { result } = renderHook(() => useSyncState(0));

    const [, setState] = result.current!;

    const prevState = result?.current?.[0];

    act(() => {
      setState(20);
    });

    const nextState = result?.current?.[0];
    expect(nextState).not.toBe(prevState);
    expect(nextState).toBe(20);
  });
});
