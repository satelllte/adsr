import Link from 'next/link';
import {GitHubLogoIcon} from '@radix-ui/react-icons';

export function GitHubLink() {
  return (
    <Link
      href='https://github.com/satelllte/adsr'
      target='_blank'
      className='flex items-center'
    >
      <GitHubLogoIcon className='mr-1 inline h-4 w-4' />
      <span>satelllte/adsr</span>
    </Link>
  );
}
