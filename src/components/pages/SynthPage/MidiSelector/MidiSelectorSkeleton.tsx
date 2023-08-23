import {Skeleton} from '@/components/ui/Skeleton';
import {MidiSelectorContainer} from './MidiSelectorContainer';

export function MidiSelectorSkeleton() {
  return (
    <MidiSelectorContainer isActive={false}>
      <Skeleton />
    </MidiSelectorContainer>
  );
}
