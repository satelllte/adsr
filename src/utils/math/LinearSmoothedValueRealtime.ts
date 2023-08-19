import {LinearSmoothedValue} from './LinearSmoothedValue';

/**
 * Same as `LinearSmoothedValue`,
 * but the timing is calculated automatically using High precision timing API:
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/High_precision_timing
 */
export class LinearSmoothedValueRealtime {
  private readonly _lsv: LinearSmoothedValue;

  constructor({
    currentValue,
    targetValue,
    rampDurationInMilliseconds,
  }: {
    currentValue: number;
    targetValue: number;
    rampDurationInMilliseconds: number;
  }) {
    this._lsv = new LinearSmoothedValue({
      currentValue,
      targetValue,
      rampDuration: rampDurationInMilliseconds,
      currentTime: this._now(),
    });
  }

  public setTargetValue(newValue: number): void {
    this._updateTime();
    this._lsv.setTargetValue(newValue);
  }

  public setCurrentAndTargetValue(newValue: number): void {
    this._updateTime();
    this._lsv.setCurrentAndTargetValue(newValue);
  }

  public getCurrentValue(): number {
    this._updateTime();
    return this._lsv.getCurrentValue();
  }

  private _now(): number {
    return performance.now();
  }

  private _updateTime(): void {
    this._lsv.increaseTimeBy(this._now() - this._lsv.currentTime);
  }
}
