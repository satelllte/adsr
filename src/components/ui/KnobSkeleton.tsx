import clsx from 'clsx';

type KnobSkeletonProps = {
  isLarge?: boolean;
};

export function KnobSkeleton({isLarge = false}: KnobSkeletonProps) {
  return (
    <div
      className={clsx(
        'bg-gray-3 motion-safe:animate-pulse',
        isLarge ? 'h-20 w-16 sm:h-24 sm:w-20' : 'h-16 w-12 sm:h-20 sm:w-16',
      )}
    />
  );
}
