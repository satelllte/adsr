import clsx from 'clsx';

type DotStatusProps = {
  isEnabled: boolean;
};

export function DotStatus({isEnabled}: DotStatusProps) {
  return (
    <div
      className={clsx(
        'h-2 w-2 rounded-full',
        isEnabled ? 'bg-green' : 'bg-gray-3',
      )}
    />
  );
}
