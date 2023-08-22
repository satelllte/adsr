import {describe, expect, it, vi} from 'vitest';

describe('fake timers', () => {
  it('works for performance.now?', () => {
    vi.useFakeTimers();

    console.debug('(before) performance.now() [1] | ', performance.now());
    console.debug('(before) performance.now() [2] | ', performance.now());
    console.debug('(before) performance.now() [3] | ', performance.now());

    vi.advanceTimersByTime(5000); // Advance fake time by 5 seconds

    console.debug('(after) performance.now() [1] | ', performance.now());
    console.debug('(after) performance.now() [2] | ', performance.now());
    console.debug('(after) performance.now() [3] | ', performance.now());

    vi.useRealTimers();
  });
});
