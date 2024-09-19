import React from 'react';

export default function useSyncState<T>(defaultValue: T) {
  const [state, setState] = React.useState(defaultValue);

  const stateRef = React.useRef(state);
  stateRef.current = state;

  const getState = React.useCallback(() => stateRef.current, []);

  return [state, setState, getState] as const;
}
