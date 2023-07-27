/**
 * (WIP) NormalisableRange class taken from JUCE Framework
 */

type ValueRemapFunction = (
  rangeStart: number,
  rangeEnd: number,
  valueToRemap: number,
) => number;

export class NormalisableRange {
  start: number;
  end: number;
  interval: number;
  skew: number;
  symmetricSkew: boolean;
  convertFrom0To1Function?: ValueRemapFunction;
  convertTo0To1Function?: ValueRemapFunction;
  snapToLegalValueFunction?: ValueRemapFunction;

  // eslint-disable-next-line max-params
  constructor(
    rangeStart: number,
    rangeEnd: number,
    intervalValue?: number,
    skewFactor?: number,
    useSymmetricSkew?: boolean,
  ) {
    this.start = rangeStart;
    this.end = rangeEnd;
    this.interval = intervalValue ?? 0;
    this.skew = skewFactor ?? 1;
    this.symmetricSkew = useSymmetricSkew ?? false;
    this.checkInvariants();
  }

  checkInvariants(): void {
    if (this.end <= this.start) {
      throw new Error('End must be greater than start.');
    }

    if (this.interval < 0) {
      throw new Error('Interval cannot be negative.');
    }

    if (this.skew <= 0) {
      throw new Error('Skew must be greater than zero.');
    }
  }

  convertTo0to1(v: number): number {
    if (this.convertTo0To1Function) {
      return this.clampTo0To1(
        this.convertTo0To1Function(this.start, this.end, v),
      );
    }

    const proportion = this.clampTo0To1(
      (v - this.start) / (this.end - this.start),
    );

    if (this.skew === 1) {
      return proportion;
    }

    if (!this.symmetricSkew) {
      return proportion ** this.skew;
    }

    const distanceFromMiddle = 2 * proportion - 1;
    return (
      (1 +
        Math.abs(distanceFromMiddle) ** this.skew *
          (distanceFromMiddle < 0 ? -1 : 1)) /
      2
    );
  }

  convertFrom0to1(proportion: number): number {
    proportion = this.clampTo0To1(proportion);

    if (this.convertFrom0To1Function) {
      return this.convertFrom0To1Function(this.start, this.end, proportion);
    }

    if (!this.symmetricSkew) {
      if (this.skew !== 1 && proportion > 0) {
        proportion = Math.exp(Math.log(proportion) / this.skew);
      }

      return this.start + (this.end - this.start) * proportion;
    }

    let distanceFromMiddle = 2 * proportion - 1;

    if (this.skew !== 1 && distanceFromMiddle !== 0) {
      distanceFromMiddle =
        Math.exp(Math.log(Math.abs(distanceFromMiddle)) / this.skew) *
        (distanceFromMiddle < 0 ? -1 : 1);
    }

    return (
      this.start + ((this.end - this.start) / 2) * (1 + distanceFromMiddle)
    );
  }

  snapToLegalValue(v: number): number {
    if (this.snapToLegalValueFunction) {
      return this.snapToLegalValueFunction(this.start, this.end, v);
    }

    if (this.interval > 0) {
      v =
        this.start +
        this.interval * Math.floor((v - this.start) / this.interval + 0.5);
    }

    return v <= this.start ? this.start : v >= this.end ? this.end : v;
  }

  getRange(): [number, number] {
    return [this.start, this.end];
  }

  setSkewForCentre(centrePointValue: number): void {
    if (centrePointValue <= this.start || centrePointValue >= this.end) {
      throw new Error('Centre point value must be inside the range.');
    }

    this.symmetricSkew = false;
    console.debug('[setSkewForCentre] skew before: ', this.skew);
    this.skew =
      Math.log(0.5) /
      Math.log((centrePointValue - this.start) / (this.end - this.start));
    console.debug('[setSkewForCentre] skew after: ', this.skew);
    this.checkInvariants();
  }

  private clampTo0To1(value: number): number {
    const clampedValue = Math.min(Math.max(0, value), 1);

    // If you hit this assertion then either your normalisation function is not working
    // correctly or your input is out of the expected bounds.
    if (clampedValue !== value) {
      throw new Error('Value out of bounds.');
    }

    return clampedValue;
  }
}
