type KnobsContainerProps = {
  children: React.ReactNode;
};

export function KnobsContainer({children}: KnobsContainerProps) {
  return <div className='flex flex-wrap justify-center gap-3'>{children}</div>;
}
