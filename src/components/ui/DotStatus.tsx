import clsx from 'clsx';

type DotStatusProps = {
  status: 'enabled' | 'disabled' | 'error';
};

export function DotStatus({status}: DotStatusProps) {
  return (
    <div
      className={clsx(
        'h-2 w-2 rounded-full',
        status === 'enabled' && 'bg-green',
        status === 'disabled' && 'bg-gray-3',
        status === 'error' && 'bg-red',
      )}
    />
  );
}
