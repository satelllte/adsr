import {DotStatus} from '@/components/ui/DotStatus';

type MidiSelectorContainerProps = {
  isActive: boolean;
  children: React.ReactNode;
};

export function MidiSelectorContainer({
  isActive,
  children,
}: MidiSelectorContainerProps) {
  return (
    <div className='flex h-10 w-60 max-w-full select-none items-center gap-2 bg-gray-2 px-2 py-1 text-xs'>
      <DotStatus isEnabled={isActive} />
      <div className='text-sm'>MIDI</div>
      <div className='relative flex flex-1 items-center justify-center self-stretch'>
        {children}
      </div>
    </div>
  );
}
