import {describe, expect, it} from 'vitest';
import {clamp, clamp01} from './clamp';

describe('clamp', () => {
  describe('clamp', () => {
    it('returns X when it is within the range [MIN..MAX]', () => {
      expect(clamp(5, 0, 10)).toEqual(5);
      expect(clamp(-2, -5, 5)).toEqual(-2);
      expect(clamp(100, 50, 200)).toEqual(100);
    });

    it('returns MIN value when X is less than MIN', () => {
      expect(clamp(-10, 0, 10)).toEqual(0);
      expect(clamp(-100, -50, 50)).toEqual(-50);
      expect(clamp(0, 10, 20)).toEqual(10);
    });

    it('returns MAX value when X is greater than MAX', () => {
      expect(clamp(15, 0, 10)).toEqual(10);
      expect(clamp(200, -50, 50)).toEqual(50);
      expect(clamp(25, 10, 20)).toEqual(20);
    });
  });

  describe('clamp01', () => {
    it('returns X when it is within the range [0..1]', () => {
      expect(clamp01(0.5)).toEqual(0.5);
      expect(clamp01(0)).toEqual(0);
      expect(clamp01(1)).toEqual(1);
    });

    it('returns 0 when X is less than 0', () => {
      expect(clamp01(-0.5)).toEqual(0);
      expect(clamp01(-10)).toEqual(0);
    });

    it('returns 1 when X is greater than 1', () => {
      expect(clamp01(1.5)).toEqual(1);
      expect(clamp01(10)).toEqual(1);
    });
  });
});
