import clsx from 'clsx';
import {type ComponentProps} from 'react';
import {Skeleton} from './Skeleton';

type DivProps = ComponentProps<'div'>;

type InteractionAreaProps = Omit<DivProps, 'className' | 'children'> & {
  icon: React.ReactNode;
  title: string;
};

const baseClass = clsx(
  'flex h-32 w-full max-w-md select-none flex-col items-center justify-center gap-1 rounded-md border border-dashed border-gray-4 p-4 text-center text-gray-5 sm:p-8',
);

export function InteractionArea({icon, title, ...rest}: InteractionAreaProps) {
  return (
    <div className={baseClass} {...rest}>
      {icon}
      <span>{title}</span>
    </div>
  );
}

export function InteractionAreaSkeleton() {
  return (
    <div className={baseClass}>
      <Skeleton />
    </div>
  );
}
