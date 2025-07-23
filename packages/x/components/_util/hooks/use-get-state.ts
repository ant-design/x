import { useCallback, useRef, useState } from 'react';

function useGetState<T>(
  initialState: T | (() => T),
): [T, React.Dispatch<React.SetStateAction<T>>, () => T] {
  const [state, _setState] = useState<T>(initialState);
  const stateRef = useRef<T>(state);

  const setState = useCallback((newValue: React.SetStateAction<T>) => {
    const value =
      typeof newValue === 'function'
        ? (newValue as (prevState: T) => T)(stateRef.current)
        : newValue;
    stateRef.current = value;
    _setState(value);
  }, []);

  const getState = useCallback(() => {
    return stateRef.current;
  }, []);

  return [state, setState, getState];
}

export default useGetState;
