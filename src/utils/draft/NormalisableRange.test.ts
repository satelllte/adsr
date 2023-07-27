import {describe, it} from 'vitest';
import {NormalisableRange} from './NormalisableRange';

describe('NormalisableRange', () => {
  it('works', () => {
    /// const nr = new NormalisableRange(0, 60000, 0.01, 1);
    const nr = new NormalisableRange(30, 18500, 0.1, 1);
    nr.setSkewForCentre(745);
    for (let i = 0; i <= 1; i += 0.125) {
      const v = nr.convertFrom0to1(i);
      console.debug(`${i} | (raw) ${v} | (legal) ${nr.snapToLegalValue(v)}`);
    }

    console.debug('nr.snapToLegalValue(-1): ', nr.snapToLegalValue(-1));
    console.debug('nr.snapToLegalValue(37.777): ', nr.snapToLegalValue(37.777));
    console.debug('nr.snapToLegalValue(19000): ', nr.snapToLegalValue(19000));

    console.debug('nr.convertTo0to1(18500): ', nr.convertTo0to1(18500));
  });
});
