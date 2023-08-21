import {el, type NodeRepr_t} from '@elemaudio/core';
import {useRef} from 'react';

/**
 * A hook that wraps Elementary Audio `el.const`
 */
export const useElConst = (key: string, initialValue: number) => {
  const constRef = useRef<NodeRepr_t>(el.const({key, value: initialValue}));
  return {
    get: () => constRef.current,
    update(value: number) {
      constRef.current = el.const({key, value});
    },
  };
};
