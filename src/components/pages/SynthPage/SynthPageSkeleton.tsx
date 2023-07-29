import {Centered} from '@/components/layout/Centered';
import {SynthContainer} from './SynthContainer';
import {PageElementContainer} from './PageElementContainer';
import {KnobsLayout} from './KnobsLayout';
import {KnobSkeleton} from '@/components/ui/KnobSkeleton';
import {title} from './constants';

export function SynthPageSkeleton() {
  return (
    <Centered>
      <PageElementContainer>
        <SynthContainer title={title}>
          <KnobsLayout>
            <KnobSkeleton isLarge />
            <KnobSkeleton />
            <KnobSkeleton />
            <KnobSkeleton />
            <KnobSkeleton />
          </KnobsLayout>
        </SynthContainer>
      </PageElementContainer>
    </Centered>
  );
}
