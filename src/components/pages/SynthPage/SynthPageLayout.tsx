import {GitHubLink} from '@/components/ui/GitHubLink';

type SynthPageLayoutProps = {
  topPanel?: React.ReactNode;
  children: [React.ReactNode, React.ReactNode];
};

export function SynthPageLayout({topPanel, children}: SynthPageLayoutProps) {
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center'>
      <div className='absolute left-1/2 top-0 max-w-full -translate-x-1/2 sm:left-0 sm:translate-x-0'>
        {topPanel}
      </div>
      <div className='flex w-full items-center justify-center px-4 pt-8'>
        {children[0]}
      </div>
      <div className='flex w-full items-center justify-center px-4 pt-16'>
        {children[1]}
      </div>
      <div className='absolute bottom-2'>
        <GitHubLink />
      </div>
    </div>
  );
}
