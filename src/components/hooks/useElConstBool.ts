import {useMemo} from 'react';
import {useElConst} from './useElConst';

/**
 * Same as `useElConst` but for boolean value.
 * Useful for gates, switches, toggles, etc.
 */
export const useElConstBool = (key: string, initialValue: boolean) => {
  const elConst = useElConst(key, toNumber(initialValue));
  return useMemo(
    () => ({
      ...elConst,
      update(value: boolean) {
        elConst.update(toNumber(value));
      },
    }),
    [elConst],
  );
};

const toNumber = (value: boolean): number => (value ? 1 : 0);
