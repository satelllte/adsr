import {KnobSkeleton} from '@/components/ui/KnobSkeleton';
import {InteractionAreaSkeleton} from '@/components/ui/InteractionArea';
import {SynthPageLayout} from './SynthPageLayout';
import {SynthContainer} from './SynthContainer';
import {KnobsLayout} from './KnobsLayout';
import {title} from './constants';

export function SynthPageSkeleton() {
  return (
    <SynthPageLayout>
      <SynthContainer title={title}>
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
