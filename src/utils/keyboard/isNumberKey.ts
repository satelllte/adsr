/**
 * Tells if the input key is a fractional number key: 0-9, comma or dot.
 */
export const isNumberKey = (key: KeyboardEvent['key']): boolean =>
  /^[,.\d]$/.test(key);
