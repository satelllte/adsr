type SynthContainerProps = {
  title: string;
  children: React.ReactNode;
};

export function SynthContainer({title, children}: SynthContainerProps) {
  return (
    <div className='bg-gray-2'>
      <div className='flex select-none items-center gap-2 bg-gray-1 px-2 py-1 text-sm'>
        <div className='h-2 w-2 rounded-full bg-green' />
        {title}
      </div>
      <div className='p-4'>{children}</div>
    </div>
  );
}
