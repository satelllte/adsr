import {useCallback, useRef, useState} from 'react';

/**
 * Synchronously call a callback on every state change.
 *
 * The callback should be idempotent as it may be called multiple times by React.
 *
 * @param initialState
 * @param callback
 */
export const useStateWithEffect = <T extends Record<string, unknown>>(
  initialState: T,
  callback: (state: T) => unknown,
) => {
  const [state, setState] = useState(0);
  const stateRef = useRef(initialState);

  const setStateWithEffect = useCallback(
    (update: Partial<T>) => {
      // Using a ref here means the setStateWithEffect function remains stable across renders
      Object.assign(stateRef.current, update);
      callback(stateRef.current);
      // But we still want to trigger a re-render and update any UI
      setState((count) => count + 1);
    },
    [callback],
  );

  return [stateRef.current, setStateWithEffect] as const;
};
