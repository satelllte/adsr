'use client';
import {Suspense, lazy, useState} from 'react';
import {PlayIcon} from '@/components/icons';
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
        <button
          type='button'
          className='cursor-default bg-gray-2 px-8 py-2 outline-none webkit-tap-transparent hover:bg-gray-3 focus-visible:outline-1 focus-visible:outline-gray-5 active:bg-gray-4 md:px-10 lg:px-12 lg:py-3'
          onClick={launch}
        >
          <PlayIcon />
        </button>
      </div>
    );
  }

  return (
    <Suspense fallback={<SynthPageSkeleton />}>
      <SynthPage />
    </Suspense>
  );
}
