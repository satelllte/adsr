'use client';
import {Suspense, lazy, useState} from 'react';
import {PlayIcon} from '@/components/icons/PlayIcon';
import {Centered} from '@/components/layout/Centered';
import {SynthPageSkeleton} from '@/components/pages/SynthPage';

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
      <Centered>
        <button
          type='button'
          className='bg-gray-2 px-8 py-2 outline-none webkit-tap-transparent hover:bg-gray-3 focus-visible:outline-1 focus-visible:outline-gray-5 active:bg-gray-4 md:px-10 lg:px-12 lg:py-3'
          onClick={launch}
        >
          <PlayIcon />
        </button>
      </Centered>
    );
  }

  return (
    <Suspense fallback={<SynthPageSkeleton />}>
      <SynthPage />
    </Suspense>
  );
}
