import {describe, expect, it} from 'vitest';
import {isNumberKey} from './isNumberKey';

describe('isNumberKey', () => {
  it('returns true if the input key is digit, comma or dot', () => {
    expect(isNumberKey('0')).toBe(true);
    expect(isNumberKey('1')).toBe(true);
    expect(isNumberKey('2')).toBe(true);
    expect(isNumberKey('3')).toBe(true);
    expect(isNumberKey('4')).toBe(true);
    expect(isNumberKey('5')).toBe(true);
    expect(isNumberKey('6')).toBe(true);
    expect(isNumberKey('7')).toBe(true);
    expect(isNumberKey('8')).toBe(true);
    expect(isNumberKey('9')).toBe(true);
    expect(isNumberKey('.')).toBe(true);
    expect(isNumberKey(',')).toBe(true);
  });

  it('returns false for anything else', () => {
    expect(isNumberKey('A')).toBe(false);
    expect(isNumberKey('a')).toBe(false);
    expect(isNumberKey('Z')).toBe(false);
    expect(isNumberKey('z')).toBe(false);
    expect(isNumberKey('-')).toBe(false);
    expect(isNumberKey('+')).toBe(false);
    expect(isNumberKey('-')).toBe(false);
    expect(isNumberKey('*')).toBe(false);
    expect(isNumberKey(' ')).toBe(false);
  });
});
