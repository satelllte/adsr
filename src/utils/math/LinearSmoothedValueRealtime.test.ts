import {describe, expect, it} from 'vitest';
import {PerformanceNowMock} from './../testing/PerformanceNowMock';
import {LinearSmoothedValueRealtime} from './LinearSmoothedValueRealtime';

describe('LinearSmoothedValueRealtime', () => {
  it('interpolates properly', () => {
    const performanceNowMock = new PerformanceNowMock(1000);
    const lsvr = new LinearSmoothedValueRealtime({
      currentValue: 0,
      targetValue: 100,
      rampDurationInMilliseconds: 1000,
    });

    expect(lsvr.getCurrentValue()).toBe(0);

    performanceNowMock.advanceTimeBy(250);
    expect(lsvr.getCurrentValue()).toBe(25);

    performanceNowMock.advanceTimeBy(500);
    expect(lsvr.getCurrentValue()).toBe(81.25);

    performanceNowMock.advanceTimeBy(250);
    expect(lsvr.getCurrentValue()).toBe(100); // Ramp finishes at this point.

    performanceNowMock.advanceTimeBy(250);
    expect(lsvr.getCurrentValue()).toBe(100); // Going past the ramp duration should not change the value.

    performanceNowMock.end();
  });

  it('reacts to target value changes', () => {
    const performanceNowMock = new PerformanceNowMock(15000);
    const lsvr = new LinearSmoothedValueRealtime({
      currentValue: 0,
      targetValue: 100,
      rampDurationInMilliseconds: 1000,
    });

    expect(lsvr.getCurrentValue()).toBe(0);

    performanceNowMock.advanceTimeBy(500);
    expect(lsvr.getCurrentValue()).toBe(50);

    lsvr.setTargetValue(200);
    expect(lsvr.getCurrentValue()).toBe(50); // Ramp restarts from this time now. So it needs to pass full duration to reach target.

    performanceNowMock.advanceTimeBy(500);
    expect(lsvr.getCurrentValue()).toBe(125);

    performanceNowMock.advanceTimeBy(500);
    expect(lsvr.getCurrentValue()).toBe(200); // Ramp finishes at this point.

    performanceNowMock.advanceTimeBy(500);
    expect(lsvr.getCurrentValue()).toBe(200); // Going past the ramp duration should not change the value.

    performanceNowMock.end();
  });

  it('reacts to current & target value changes', () => {
    const performanceNowMock = new PerformanceNowMock(15000);
    const lsvr = new LinearSmoothedValueRealtime({
      currentValue: 0,
      targetValue: 100,
      rampDurationInMilliseconds: 2000,
    });

    expect(lsvr.getCurrentValue()).toBe(0);

    lsvr.setCurrentAndTargetValue(50);
    expect(lsvr.getCurrentValue()).toBe(50); // No ramping will happen anymore because current value equals to target.

    performanceNowMock.advanceTimeBy(500);
    expect(lsvr.getCurrentValue()).toBe(50); // Going past the ramp duration should not change the value.

    performanceNowMock.end();
  });
});
