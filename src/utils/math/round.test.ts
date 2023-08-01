import {describe, expect, it} from 'vitest';
import {round} from './round';

describe('round', () => {
  it('should round the value to the specified precision', () => {
    expect(round(3.14159, 2)).toBe(3.14);
    expect(round(5.6789, 1)).toBe(5.7);
    expect(round(10.123456789, 4)).toBe(10.1235);
    expect(round(100.9999, 0)).toBe(101);
  });

  it('should round the value to the specified negative precision', () => {
    expect(round(3141, -1)).toBe(3140);
    expect(round(3141, -2)).toBe(3100);
    expect(round(3141, -3)).toBe(3000);
    expect(round(3741, -3)).toBe(4000);
  });

  it('should round the value to the nearest integer when no precision is specified', () => {
    expect(round(3.14159)).toBe(3);
    expect(round(5.6789)).toBe(6);
    expect(round(10.123456789)).toBe(10);
    expect(round(100.9999)).toBe(101);
  });

  it('should round negative values correctly', () => {
    expect(round(-3.14159, 2)).toBe(-3.14);
    expect(round(-5.6789, 1)).toBe(-5.7);
    expect(round(-10.123456789, 4)).toBe(-10.1235);
    expect(round(-100.9999, 0)).toBe(-101);
  });
});
