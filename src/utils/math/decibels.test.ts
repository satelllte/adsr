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
    expect(gainToDecibels(0.03125)).toBeCloseTo(-30.1);
    expect(gainToDecibels(0.015625)).toBeCloseTo(-36.12);
    expect(gainToDecibels(0.0078125)).toBeCloseTo(-42.14);
    expect(gainToDecibels(0.00390625)).toBeCloseTo(-48.16);
    expect(gainToDecibels(0.001953125)).toBeCloseTo(-54.185);
  });
});
