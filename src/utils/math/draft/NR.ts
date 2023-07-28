import {clamp01} from '../clamp';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class NR {
  private readonly _min: number;
  private readonly _max: number;
  private readonly _skew: number;

  constructor(min: number, max: number, center: number) {
    this._min = min;
    this._max = max;
    this._skew = Math.log(0.5) / Math.log((center - min) / (max - min));
  }

  public mapTo01(x: number): number {
    const proportion = clamp01((x - this._min) / (this._max - this._min));

    if (this._skew === 1) {
      return proportion;
    }

    return proportion ** this._skew;
  }

  public mapFrom01(proportion: number): number {
    proportion = clamp01(proportion);

    if (this._skew !== 1 && proportion > 0) {
      proportion = Math.exp(Math.log(proportion) / this._skew);
    }

    return this._min + (this._max - this._min) * proportion;
  }
}
