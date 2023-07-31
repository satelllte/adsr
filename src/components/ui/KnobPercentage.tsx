import {round} from '@/utils/math';
import {Knob, type KnobProps} from './Knob';

export type KnobPercentageProps = Omit<
  KnobProps,
  | 'min'
  | 'max'
  | 'displayValueFn'
  | 'roundFn'
  | 'fromManualInputFn'
  | 'toManualInputFn'
  | 'mapTo01'
  | 'mapFrom01'
>;

export function KnobPercentage(props: KnobPercentageProps) {
  return (
    <Knob
      min={0}
      max={1}
      displayValueFn={displayValueFn}
      roundFn={roundFn}
      fromManualInputFn={fromManualInputFn}
      toManualInputFn={toManualInputFn}
      {...props}
    />
  );
}

const displayValueFn = (val: number) => {
  const val100 = round(val * 100, 1);
  return `${val100 < 10 ? val100.toFixed(1) : val100.toFixed(0)} %`;
};

const roundFn = (val: number): number => round(val, 3);

const fromManualInputFn = (val100: number): number => val100 / 100;

const toManualInputFn = (val: number): number => {
  const val100 = val * 100;

  if (val100 < 10) {
    return round(val100, 1);
  }

  return round(val100);
};
