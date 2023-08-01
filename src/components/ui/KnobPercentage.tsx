import {round} from '@/utils/math';
import {Knob, type KnobProps} from './Knob';

export type KnobPercentageProps = Omit<
  KnobProps,
  | 'min'
  | 'max'
  | 'displayValueFn'
  | 'toManualInputFn'
  | 'fromManualInputFn'
  | 'mapTo01'
  | 'mapFrom01'
>;

export function KnobPercentage(props: KnobPercentageProps) {
  return (
    <Knob
      min={0}
      max={1}
      displayValueFn={displayValueFn}
      toManualInputFn={toManualInputFn}
      fromManualInputFn={fromManualInputFn}
      {...props}
    />
  );
}

const displayValueFn = (value: number) => {
  const percent = round(value * 100, 1);
  return `${percent < 10 ? percent.toFixed(1) : percent.toFixed(0)} %`;
};

const toManualInputFn = (value: number): number => {
  const percent = value * 100;
  return percent < 10 ? round(percent, 1) : round(percent);
};

const fromManualInputFn = (percent: number): number => percent / 100;
