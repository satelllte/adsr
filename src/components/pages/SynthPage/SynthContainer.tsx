import clsx from 'clsx';

type SynthContainerProps = {
  isActivated?: boolean;
  title: string;
  children: React.ReactNode;
  meterLeftRef: React.RefObject<HTMLCanvasElement>;
  meterRightRef: React.RefObject<HTMLCanvasElement>;
};

export function SynthContainer({
  isActivated = false,
  title,
  children,
  meterLeftRef,
  meterRightRef,
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
      <div className='flex'>
        <div className='p-2 sm:p-3'>{children}</div>
        <div className='flex w-4 gap-0.5'>
          <div className='relative flex-1'>
            <canvas ref={meterLeftRef} className='h-full w-full bg-gray-3' />
          </div>
          <div className='relative flex-1'>
            <canvas ref={meterRightRef} className='h-full w-full bg-gray-3' />
          </div>
        </div>
      </div>
    </div>
  );
}
