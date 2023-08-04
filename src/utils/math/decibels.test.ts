import {describe, expect, it} from 'vitest';
import {gainToDecibels} from './decibels';

describe('gainToDecibels', () => {
  it('should convert gain to decibels correctly', () => {
    expect(gainToDecibels(10)).toBeCloseTo(20.0);
    expect(gainToDecibels(2)).toBeCloseTo(6.02);
    expect(gainToDecibels(1)).toBeCloseTo(0);
    expect(gainToDecibels(0.5)).toBeCloseTo(-6.02);
    expect(gainToDecibels(0.25)).toBeCloseTo(-12.04);
    expect(gainToDecibels(0.125)).toBeCloseTo(-18.06);
    expect(gainToDecibels(0.0625)).toBeCloseTo(-24.08);
  });
});
