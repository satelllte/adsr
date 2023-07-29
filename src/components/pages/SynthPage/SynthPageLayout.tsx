type SynthPageLayoutProps = {
  children: [React.ReactNode, React.ReactNode];
};

export function SynthPageLayout({children}: SynthPageLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <div className='mx-4 mt-8 max-w-full'>{children[0]}</div>
      <div className='mx-4 mt-16 max-w-full'>{children[1]}</div>
    </div>
  );
}
