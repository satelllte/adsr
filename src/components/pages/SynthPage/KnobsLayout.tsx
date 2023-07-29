type KnobsLayoutProps = {
  children: [
    React.ReactNode,
    React.ReactNode,
    React.ReactNode,
    React.ReactNode,
    React.ReactNode,
  ];
};

export function KnobsLayout({children}: KnobsLayoutProps) {
  return (
    <div className='grid grid-cols-2 grid-rows-3 gap-x-2 sm:grid-cols-6 sm:grid-rows-none sm:gap-x-2 sm:gap-y-0'>
      <div className='col-span-2 flex justify-center sm:justify-start'>
        {children[0]}
      </div>
      <div className='flex items-center justify-center'>{children[1]}</div>
      <div className='flex items-center justify-center'>{children[2]}</div>
      <div className='flex items-center justify-center'>{children[3]}</div>
      <div className='flex items-center justify-center'>{children[4]}</div>
    </div>
  );
}
