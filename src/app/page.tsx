'use client';
import {Suspense, lazy, useState} from 'react';
import {PlayIcon} from '@radix-ui/react-icons';
import {Centered} from '@/components/layout/Centered';

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
          className='bg-brand-gray-2 px-8 py-2 outline-none webkit-tap-transparent hover:bg-brand-gray-3 focus-visible:outline-1 focus-visible:outline-brand-gray-5 active:bg-brand-gray-4 md:px-10 lg:px-12 lg:py-3'
          onClick={launch}
        >
          <PlayIcon className='h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7' />
        </button>
      </Centered>
    );
  }

  return (
    <Suspense>
      <SynthPage />
    </Suspense>
  );
}
