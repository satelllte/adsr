import clsx from 'clsx';
import {baseClass} from './constants';

export function SkeletonIcon() {
  return (
    <div className={clsx(baseClass, 'bg-gray-5 motion-safe:animate-pulse')} />
  );
}
