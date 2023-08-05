import clsx from 'clsx';
import {forwardRef} from 'react';

type CanvasNativeProps = React.ComponentProps<'canvas'>;
type MeterProps = Omit<CanvasNativeProps, 'className'>;

const baseClass = clsx('absolute h-full w-full bg-gray-3');

export const Meter = forwardRef<HTMLCanvasElement, MeterProps>((props, ref) => (
  <canvas ref={ref} className={baseClass} {...props} />
));

export function MeterSkeleton() {
  return <div className={clsx(baseClass, 'motion-safe:animate-pulse')} />;
}
