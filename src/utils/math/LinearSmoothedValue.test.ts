import {describe, expect, it} from 'vitest';
import {LinearSmoothedValue} from './LinearSmoothedValue';

describe('LinearSmoothedValue', () => {
  it('interpolates properly', () => {
    const lsv = new LinearSmoothedValue({
      currentValue: 0,
      targetValue: 100,
      rampDuration: 1000,
    });

    expect(lsv.currentTime).toBe(0);
    expect(lsv.getCurrentValue()).toBe(0);

    lsv.increaseTimeBy(250);
    expect(lsv.currentTime).toBe(250);
    expect(lsv.getCurrentValue()).toBe(25);

    lsv.increaseTimeBy(500);
    expect(lsv.currentTime).toBe(750);
    expect(lsv.getCurrentValue()).toBe(81.25);

    lsv.increaseTimeBy(250);
    expect(lsv.currentTime).toBe(1000);
    expect(lsv.getCurrentValue()).toBe(100); // Ramp finishes at this point.

    lsv.increaseTimeBy(250);
    expect(lsv.currentTime).toBe(1250);
    expect(lsv.getCurrentValue()).toBe(100); // Going past the ramp duration should not change the value.
  });

  it('interpolates properly with custom initial currentTime', () => {
    const lsv = new LinearSmoothedValue({
      currentValue: 100,
      targetValue: -100,
      rampDuration: 1000,
      currentTime: 200,
    });

    expect(lsv.currentTime).toBe(200);
    expect(lsv.getCurrentValue()).toBe(100);

    lsv.increaseTimeBy(500);
    expect(lsv.currentTime).toBe(700);
    expect(lsv.getCurrentValue()).toBe(0);

    lsv.increaseTimeBy(250);
    expect(lsv.currentTime).toBe(950);
    expect(lsv.getCurrentValue()).toBe(-75);
  });

  it('reacts to target value changes', () => {
    const lsv = new LinearSmoothedValue({
      currentValue: 0,
      targetValue: 100,
      rampDuration: 1000,
    });

    expect(lsv.currentTime).toBe(0);
    expect(lsv.getCurrentValue()).toBe(0);

    lsv.increaseTimeBy(500);
    expect(lsv.currentTime).toBe(500);
    expect(lsv.getCurrentValue()).toBe(50);

    lsv.setTargetValue(200);
    expect(lsv.currentTime).toBe(500); // Ramp restarts from this time now. So it needs to pass full duration to reach target.
    expect(lsv.getCurrentValue()).toBe(50);

    lsv.increaseTimeBy(500);
    expect(lsv.currentTime).toBe(1000);
    expect(lsv.getCurrentValue()).toBe(125);

    lsv.increaseTimeBy(500);
    expect(lsv.currentTime).toBe(1500);
    expect(lsv.getCurrentValue()).toBe(200); // Ramp finishes at this point.

    lsv.increaseTimeBy(500);
    expect(lsv.currentTime).toBe(2000);
    expect(lsv.getCurrentValue()).toBe(200); // Going past the ramp duration should not change the value.
  });

  it('reacts to current & target value changes', () => {
    const lsv = new LinearSmoothedValue({
      currentValue: 0,
      targetValue: 100,
      rampDuration: 1000,
    });

    expect(lsv.currentTime).toBe(0);
    expect(lsv.getCurrentValue()).toBe(0);

    lsv.setCurrentAndTargetValue(50);
    expect(lsv.currentTime).toBe(0);
    expect(lsv.getCurrentValue()).toBe(50); // No ramping will happen anymore because current value equals to target.

    lsv.increaseTimeBy(500);
    expect(lsv.currentTime).toBe(500);
    expect(lsv.getCurrentValue()).toBe(50); // Going past the ramp duration should not change the value.
  });
});
