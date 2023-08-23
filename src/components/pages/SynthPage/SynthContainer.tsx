import {DotStatus} from '@/components/ui/DotStatus';

type SynthContainerProps = {
  isEnabled?: boolean;
  title: string;
  children: React.ReactNode;
  meterLeft: React.ReactNode;
  meterRight: React.ReactNode;
};

export function SynthContainer({
  isEnabled = false,
  title,
  children,
  meterLeft,
  meterRight,
}: SynthContainerProps) {
  return (
    <div className='bg-gray-2'>
      <div className='flex select-none items-center gap-2 bg-gray-1 px-2 py-1 text-sm uppercase'>
        <DotStatus status={isEnabled ? 'enabled' : 'disabled'} />
        {title}
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
