import clsx from 'clsx';

type SynthContainerProps = {
  isActivated?: boolean;
  title: string;
  titleRight?: React.ReactNode;
  children: React.ReactNode;
  meterLeft: React.ReactNode;
  meterRight: React.ReactNode;
};

export function SynthContainer({
  isActivated = false,
  title,
  titleRight,
  children,
  meterLeft,
  meterRight,
}: SynthContainerProps) {
  return (
    <div className='bg-gray-2'>
      <div className='flex items-center justify-between bg-gray-1 px-2 py-1'>
        <div className='flex select-none items-center gap-2 text-sm uppercase'>
          <div
            className={clsx(
              'h-2 w-2 rounded-full',
              isActivated ? 'bg-green' : 'bg-gray-3',
            )}
          />
          {title}
        </div>
        <div className='text-xs'> {titleRight}</div>
      </div>
      <div className='flex'>
        <div className='p-2 sm:p-3'>{children}</div>
        <div className='flex w-2 gap-0.5'>
          <div className='relative flex-1'>{meterLeft}</div>
          <div className='relative flex-1'>{meterRight}</div>
        </div>
      </div>
    </div>
  );
}
