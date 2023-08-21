import {KnobSkeleton} from '@/components/ui/KnobSkeleton';
import {MeterSkeleton} from '@/components/ui/Meter';
import {InteractionAreaSkeleton} from '@/components/ui/InteractionArea';
import {MidiSelectorSkeleton} from './MidiSelector/MidiSelectorSkeleton'; // Import `MidiSelectorSkeleton` directly from its file so it won't take "webmidi" dependency into the first load bundle
import {SynthPageLayout} from './SynthPageLayout';
import {SynthContainer} from './SynthContainer';
import {KnobsLayout} from './KnobsLayout';
import {title} from './constants';

export function SynthPageSkeleton() {
  return (
    <SynthPageLayout topPanel={<MidiSelectorSkeleton />}>
      <SynthContainer
        title={title}
        meterLeft={<MeterSkeleton />}
        meterRight={<MeterSkeleton />}
      >
        <KnobsLayout>
          <KnobSkeleton isLarge />
          <KnobSkeleton />
          <KnobSkeleton />
          <KnobSkeleton />
          <KnobSkeleton />
        </KnobsLayout>
      </SynthContainer>
      <InteractionAreaSkeleton />
    </SynthPageLayout>
  );
}
