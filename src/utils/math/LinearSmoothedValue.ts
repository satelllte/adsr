/**
 * A class that smoothly interpolates between two values over time using High precision timing API:
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/High_precision_timing
 *
 * The implementation is very similar to LinearSmoothedValue from JUCE:
 * https://github.com/juce-framework/JUCE/blob/master/modules/juce_audio_basics/utilities/juce_SmoothedValue.h
 */
export class LinearSmoothedValue {
  private _currentValue: number;
  private _targetValue: number;
  private _rampStartTime: number;
  private readonly _rampLengthInSeconds: number;

  constructor(
    currentValue: number,
    targetValue: number,
    rampLengthInSeconds: number,
  ) {
    this._currentValue = currentValue;
    this._targetValue = targetValue;
    this._rampStartTime = performance.now();
    this._rampLengthInSeconds = rampLengthInSeconds;
  }

  public setTargetValue(newValue: number): void {
    this._targetValue = newValue;
    this._rampStartTime = performance.now();
  }

  public setCurrentAndTargetValue(newValue: number): void {
    this._currentValue = newValue;
    this._targetValue = newValue;
    this._rampStartTime = performance.now();
  }

  public getCurrentValue(): number {
    const deltaTime = (performance.now() - this._rampStartTime) / 1000; // Convert to seconds

    if (deltaTime >= this._rampLengthInSeconds) {
      this._currentValue = this._targetValue;
    } else {
      const lerpFactor = deltaTime / this._rampLengthInSeconds;
      this._currentValue =
        this._targetValue * lerpFactor + this._currentValue * (1 - lerpFactor);
    }

    return this._currentValue;
  }
}
