import {MidiSelectorContainer} from './MidiSelectorContainer';

export function MidiSelectorSkeleton() {
  return (
    <MidiSelectorContainer status='disabled'>
      <div className='absolute h-full w-full bg-gray-3 motion-safe:animate-pulse' />
    </MidiSelectorContainer>
  );
}
