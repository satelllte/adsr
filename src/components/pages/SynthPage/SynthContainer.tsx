import clsx from 'clsx';

type SynthContainerProps = {
  isActivated?: boolean;
  title: string;
  children: React.ReactNode;
};

export function SynthContainer({
  isActivated = false,
  title,
  children,
}: SynthContainerProps) {
  return (
    <div className='bg-gray-2'>
      <div className='flex select-none items-center gap-2 bg-gray-1 px-2 py-1 text-sm uppercase'>
        <div
          className={clsx(
            'h-2 w-2 rounded-full',
            isActivated ? 'bg-green' : 'bg-gray-3',
          )}
        />
        {title}
      </div>
      <div className='p-2 sm:p-4'>{children}</div>
    </div>
  );
}
