import {Centered} from '@/components/layout/Centered';
import {SynthContainer} from './SynthContainer';
import {PageElementContainer} from './PageElementContainer';
import {KnobsContainer} from './KnobsContainer';
import {KnobSkeleton} from '@/components/ui/KnobSkeleton';
import {title} from './constants';

export function SynthPageSkeleton() {
  return (
    <Centered>
      <PageElementContainer>
        <SynthContainer title={title}>
          <KnobsContainer>
            <KnobSkeleton />
            <KnobSkeleton />
            <KnobSkeleton />
            <KnobSkeleton />
          </KnobsContainer>
        </SynthContainer>
      </PageElementContainer>
    </Centered>
  );
}
