import clsx from 'clsx';

type CenteredProps = {
  children: React.ReactNode;
  bottomArea?: React.ReactNode;
};

export function Centered({children, bottomArea}: CenteredProps) {
  const containerClassName = clsx(
    'absolute inset-0 flex flex-col items-center justify-center',
  );

  if (bottomArea) {
    return (
      <div className={containerClassName}>
        {children}
        <div className='absolute bottom-0'>{bottomArea}</div>
      </div>
    );
  }

  return <div className={containerClassName}>{children}</div>;
}
