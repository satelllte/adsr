import clsx from 'clsx';
import {forwardRef} from 'react';

type ButtonNativeProps = React.ComponentProps<'button'>;
type ButtonProps = Omit<ButtonNativeProps, 'type' | 'className'> & {
  size: 'small' | 'large';
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({size, ...rest}, forwardRef) => {
    const baseClass = clsx(
      'cursor-default bg-gray-2 outline-none webkit-tap-transparent hover:bg-gray-3 focus-visible:outline-1 focus-visible:outline-gray-5 active:bg-gray-4',
    );
    const spacingClass = clsx(
      size === 'small' && 'px-2 py-1 md:px-4',
      size === 'large' && 'px-8 py-2 md:px-10 lg:px-12',
    );
    return (
      <button
        ref={forwardRef}
        type='button'
        className={clsx(baseClass, spacingClass)}
        {...rest}
      />
    );
  },
);
