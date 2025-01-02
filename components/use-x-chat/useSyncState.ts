import React from 'react';

type Getter<T> = () => T;
type Setter<T> = (pre: T) => T;

export default function useSyncState<T>(defaultValue: T | Getter<T>) {
  const [, forceUpdate] = React.useState(0);

  const stateRef = React.useRef<T>(
    typeof defaultValue === 'function' ? (defaultValue as Getter<T>)() : defaultValue,
  );

  const setState = React.useCallback((action: React.SetStateAction<T>) => {
    stateRef.current =
      typeof action === 'function' ? (action as Setter<T>)(stateRef.current) : action;

    forceUpdate((prev) => prev + 1);
  }, []);

  const getState: Getter<T> = React.useCallback(() => stateRef.current, []);

  return [stateRef.current, setState, getState] as const;
}
