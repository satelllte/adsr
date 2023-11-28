'use client';
import {Suspense, lazy, useState} from 'react';
import {PlayIcon} from '@/components/icons';
import {Button} from '@/components/ui/Button';
import {GitHubLink} from '@/components/ui/GitHubLink';
import {SynthPageSkeleton} from '@/components/pages/SynthPage/SynthPageSkeleton';

const SynthPage = lazy(async () => {
  const {SynthPage} = await import('@/components/pages/SynthPage');
  return {default: SynthPage};
});

export default function IndexPage() {
  const [isLaunched, setIsLaunched] = useState<boolean>(false);

  const launch = () => {
    setIsLaunched(true);
  };

  if (!isLaunched) {
    return (
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <Button size='large' aria-label='Launch' onClick={launch}>
          <PlayIcon />
        </Button>
        <div className='absolute bottom-2'>
          <GitHubLink />
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<SynthPageSkeleton />}>
      <SynthPage />
    </Suspense>
  );
}
