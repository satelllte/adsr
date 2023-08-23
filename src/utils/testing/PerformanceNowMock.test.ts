import {describe, expect, it} from 'vitest';
import {sleep} from '../promise/sleep';
import {PerformanceNowMock} from './PerformanceNowMock';

describe('PerformanceNowMock', () => {
  it('advances performance.now timing correctly', () => {
    const performanceNowMock = new PerformanceNowMock();
    expect(performance.now()).toBe(0);

    performanceNowMock.advanceTimeBy(1000);
    expect(performance.now()).toBe(1000);

    performanceNowMock.advanceTimeBy(600);
    expect(performance.now()).toBe(1600);

    performanceNowMock.advanceTimeBy(1400);
    expect(performance.now()).toBe(3000);

    performanceNowMock.end();
  });

  it('advances performance.now timing correctly with initialTimeMilliseconds', () => {
    const performanceNowMock = new PerformanceNowMock(500);
    expect(performance.now()).toBe(500);

    performanceNowMock.advanceTimeBy(1000);
    expect(performance.now()).toBe(1500);

    performanceNowMock.end();
  });

  it('does not advance time automatically', async () => {
    const performanceNowMock = new PerformanceNowMock();

    expect(performance.now()).toBe(0);

    await sleep(1);

    expect(performance.now()).toBe(0);

    performanceNowMock.end();
  });

  it('starts and ends mocking correctly', async () => {
    // REAL
    await sleep(1);
    const realTimestampStart = performance.now();
    expect(realTimestampStart).toBeGreaterThan(0);

    // MOCK
    const performanceNowMock = new PerformanceNowMock();
    expect(performance.now()).toBe(0);
    performanceNowMock.end();

    // REAL
    await sleep(1);
    const realTimestampEnd = performance.now();
    expect(realTimestampEnd).toBeGreaterThan(realTimestampStart);
  });
});
