import {type SpyInstance, vi} from 'vitest';

export class PerformanceNowMock {
  private readonly _spy: SpyInstance<never[], number>;
  private _currentTimeMilliseconds: number;

  constructor(initialTimeMilliseconds = 0) {
    this._spy = vi.spyOn(performance, 'now');
    this._currentTimeMilliseconds = initialTimeMilliseconds;
    this._updateSpyValue(this._currentTimeMilliseconds);
  }

  public advanceTimeBy(deltaTimeMilliseconds: number): void {
    this._currentTimeMilliseconds += deltaTimeMilliseconds;
    this._updateSpyValue(this._currentTimeMilliseconds);
  }

  public end(): void {
    this._spy.mockRestore();
  }

  private _updateSpyValue(x: number): void {
    this._spy.mockImplementation(() => x);
  }
}
