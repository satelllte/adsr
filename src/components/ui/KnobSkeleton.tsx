import clsx from 'clsx';
import {Skeleton} from './Skeleton';

type KnobSkeletonProps = {
  isLarge?: boolean;
};

export function KnobSkeleton({isLarge = false}: KnobSkeletonProps) {
  return (
    <div className={clsx(isLarge ? 'h-24 w-20' : 'h-20 w-16')}>
      <Skeleton />
    </div>
  );
}
