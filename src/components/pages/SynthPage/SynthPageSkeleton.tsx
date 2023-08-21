import {KnobSkeleton} from '@/components/ui/KnobSkeleton';
import {InteractionAreaSkeleton} from '@/components/ui/InteractionArea';
import {SynthPageLayout} from './SynthPageLayout';
import {SynthContainer} from './SynthContainer';
import {KnobsLayout} from './KnobsLayout';
import {title} from './constants';
import {MeterSkeleton} from '@/components/ui/Meter';

export function SynthPageSkeleton() {
  return (
    <SynthPageLayout>
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

      {/* TODO: add skeleton for `MidiSelector` component */}
      <div>...</div>
    </SynthPageLayout>
  );
}
