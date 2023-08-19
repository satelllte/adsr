/**
 * A class that calculates the value that smoothly interpolates between two values over time.
 *
 * The implementation is very similar to LinearSmoothedValue from JUCE:
 * https://github.com/juce-framework/JUCE/blob/master/modules/juce_audio_basics/utilities/juce_SmoothedValue.h
 *
 * Note that the time domain is generic here,
 * so its consumers have full control over it, which means they have to:
 * - define units (e.g. seconds, milliseconds, samples, etc.)
 * - manually update time via `increaseTimeBy` method before getting / setting the value
 */
export class LinearSmoothedValue {
  private _currentValue: number;
  private _targetValue: number;
  private _rampStartTime: number;
  private readonly _rampDuration: number;
  private _currentTime: number;

  constructor({
    currentValue,
    targetValue,
    rampDuration,
    currentTime = 0,
  }: {
    currentValue: number;
    targetValue: number;
    rampDuration: number;
    currentTime?: number;
  }) {
    this._currentValue = currentValue;
    this._targetValue = targetValue;
    this._rampDuration = rampDuration;
    this._rampStartTime = currentTime;
    this._currentTime = currentTime;
  }

  get currentTime(): number {
    return this._currentTime;
  }

  public increaseTimeBy(deltaTime: number): void {
    this._currentTime += deltaTime;
  }

  public setTargetValue(newValue: number): void {
    this._targetValue = newValue;
    this._rampStartTime = this._currentTime;
  }

  public setCurrentAndTargetValue(newValue: number): void {
    this._currentValue = newValue;
    this._targetValue = newValue;
    this._rampStartTime = this._currentTime;
  }

  public getCurrentValue(): number {
    const deltaTime = this._currentTime - this._rampStartTime;

    if (deltaTime >= this._rampDuration) {
      this._currentValue = this._targetValue;
    } else {
      const lerpFactor = deltaTime / this._rampDuration;
      this._currentValue =
        this._targetValue * lerpFactor + this._currentValue * (1 - lerpFactor);
    }

    return this._currentValue;
  }
}
