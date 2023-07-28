import {Knob, type KnobProps} from './Knob';
import {NR} from '@/utils/math/draft';
import {useConst} from '@/components/hooks/useConst';

export type KnobAdrProps = Omit<
  KnobProps,
  'min' | 'max' | 'displayValueFn' | 'mapTo01' | 'mapFrom01'
>;

export function KnobAdr(props: KnobAdrProps) {
  const min = 0.000004; // Limiting to 0.004 ms, because otherwise it'll sound weird when it's too close to the absolute zero
  const max = 60;

  const nr = useConst(() => new NR(min, max, 1.88));
  const mapTo01 = (x: number) => nr.mapTo01(x);
  const mapFrom01 = (x: number) => nr.mapFrom01(x);

  return (
    <Knob
      min={min}
      max={max}
      displayValueFn={displayValueFn}
      mapTo01={mapTo01}
      mapFrom01={mapFrom01}
      {...props}
    />
  );
}

const displayValueFn = (valueSec: number) => {
  const valueMs = valueSec * 1000;

  if (valueMs < 10) {
    return `${valueMs.toFixed(2)} ms`;
  }

  if (valueMs < 100) {
    return `${valueMs.toFixed(1)} ms`;
  }

  if (valueMs < 1000) {
    return `${valueMs.toFixed(0)} ms`;
  }

  if (valueMs < 10000) {
    return `${valueSec.toFixed(2)} s`;
  }

  return `${valueSec.toFixed(1)} s`;
};
