type CenteredProps = {
  children: React.ReactNode;
};

export function Centered({children}: CenteredProps) {
  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center'>
      {children}
    </div>
  );
}
