import clsx from 'clsx';

type KnobSkeletonProps = {
  isLarge?: boolean;
};

export function KnobSkeleton({isLarge = false}: KnobSkeletonProps) {
  return (
    <div
      className={clsx(
        'bg-gray-3 motion-safe:animate-pulse',
        isLarge ? 'h-24 w-20' : 'h-20 w-16',
      )}
    />
  );
}
