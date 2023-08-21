type SynthPageLayoutProps = {
  topPanel?: React.ReactNode;
  children: [React.ReactNode, React.ReactNode];
};

export function SynthPageLayout({topPanel, children}: SynthPageLayoutProps) {
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center'>
      <div className='absolute left-0 top-0'>{topPanel}</div>
      <div className='flex w-full items-center justify-center px-4 pt-8'>
        {children[0]}
      </div>
      <div className='flex w-full items-center justify-center px-4 pt-16'>
        {children[1]}
      </div>
    </div>
  );
}
