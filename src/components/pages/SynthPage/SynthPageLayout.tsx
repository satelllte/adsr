type SynthPageLayoutProps = {
  children: [React.ReactNode, React.ReactNode, React.ReactNode];
};

export function SynthPageLayout({children}: SynthPageLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <div className='flex w-full items-center justify-center px-4 pt-8'>
        {children[0]}
      </div>
      <div className='flex w-full items-center justify-center px-4 pt-16'>
        {children[1]}
      </div>
      <div className='flex w-full items-center justify-center px-4 pt-4'>
        {children[2]}
      </div>
    </div>
  );
}
