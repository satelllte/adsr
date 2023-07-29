import {round} from '@/utils/math';
import {Knob, type KnobProps} from './Knob';

export type KnobPercentageProps = Omit<
  KnobProps,
  'min' | 'max' | 'displayValueFn' | 'mapTo01' | 'mapFrom01'
>;

export function KnobPercentage(props: KnobPercentageProps) {
  return <Knob min={0} max={1} displayValueFn={displayValueFn} {...props} />;
}

const displayValueFn = (value: number) => {
  const v = round(value * 100, 1);
  return `${v < 10 ? v.toFixed(1) : v.toFixed(0)} %`;
};
