import {PlayIcon as RadixPlayIcon} from '@radix-ui/react-icons';
import clsx from 'clsx';

const baseClass = clsx('h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7');

export function PlayIcon() {
  return <RadixPlayIcon className={baseClass} />;
}

export function PlayIconSkeleton() {
  return (
    <div className={clsx(baseClass, 'bg-gray-5 motion-safe:animate-pulse')} />
  );
}
