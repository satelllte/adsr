import clsx from 'clsx';
import {forwardRef} from 'react';
import {Skeleton} from './Skeleton';

type CanvasNativeProps = React.ComponentProps<'canvas'>;
type MeterProps = Omit<CanvasNativeProps, 'className'>;

const baseClass = clsx('absolute h-full w-full');

export const Meter = forwardRef<HTMLCanvasElement, MeterProps>((props, ref) => (
  <canvas ref={ref} className={clsx(baseClass, 'bg-gray-3')} {...props} />
));

export function MeterSkeleton() {
  return (
    <div className={baseClass}>
      <Skeleton />
    </div>
  );
}
