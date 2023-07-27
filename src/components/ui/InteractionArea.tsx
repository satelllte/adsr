import {type ComponentProps} from 'react';

type DivProps = ComponentProps<'div'>;

type InteractionAreaProps = Omit<DivProps, 'className' | 'children'> & {
  icon: React.ReactNode;
  title: string;
};

export function InteractionArea({icon, title, ...rest}: InteractionAreaProps) {
  return (
    <div
      className='flex select-none flex-col items-center gap-1 rounded-md border border-dashed border-brand-gray-4 p-4 text-center text-brand-gray-5 sm:p-8 md:gap-2 md:p-12'
      {...rest}
    >
      {icon}
      <span>{title}</span>
    </div>
  );
}
