import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {LinearSmoothedValueRealtime} from './LinearSmoothedValueRealtime';

describe('LinearSmoothedValueRealtime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('interpolates properly', () => {
    const lsvr = new LinearSmoothedValueRealtime({
      currentValue: 0,
      targetValue: 100,
      rampDurationInMilliseconds: 1000,
    });

    expect(lsvr.getCurrentValue()).toBe(0);

    vi.advanceTimersByTime(250);
    expect(lsvr.getCurrentValue()).toBe(25);

    vi.advanceTimersByTime(500);
    expect(lsvr.getCurrentValue()).toBe(81.25);

    vi.advanceTimersByTime(250);
    expect(lsvr.getCurrentValue()).toBe(100); // Ramp finishes at this point.

    vi.advanceTimersByTime(250);
    expect(lsvr.getCurrentValue()).toBe(100); // Going past the ramp duration should not change the value.
  });

  it('reacts to target value changes', () => {
    const lsvr = new LinearSmoothedValueRealtime({
      currentValue: 0,
      targetValue: 100,
      rampDurationInMilliseconds: 1000,
    });

    expect(lsvr.getCurrentValue()).toBe(0);

    vi.advanceTimersByTime(500);
    expect(lsvr.getCurrentValue()).toBe(50);

    lsvr.setTargetValue(200);
    expect(lsvr.getCurrentValue()).toBe(50); // Ramp restarts from this time now. So it needs to pass full duration to reach target.

    vi.advanceTimersByTime(500);
    expect(lsvr.getCurrentValue()).toBe(125);

    vi.advanceTimersByTime(500);
    expect(lsvr.getCurrentValue()).toBe(200); // Ramp finishes at this point.

    vi.advanceTimersByTime(500);
    expect(lsvr.getCurrentValue()).toBe(200); // Going past the ramp duration should not change the value.
  });

  it('reacts to current & target value changes', () => {
    const lsvr = new LinearSmoothedValueRealtime({
      currentValue: 0,
      targetValue: 100,
      rampDurationInMilliseconds: 2000,
    });

    expect(lsvr.getCurrentValue()).toBe(0);

    lsvr.setCurrentAndTargetValue(50);
    expect(lsvr.getCurrentValue()).toBe(50); // No ramping will happen anymore because current value equals to target.

    vi.advanceTimersByTime(500);
    expect(lsvr.getCurrentValue()).toBe(50); // Going past the ramp duration should not change the value.
  });
});
