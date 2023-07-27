import {type Metadata} from 'next';
import {Montserrat} from 'next/font/google';
import clsx from 'clsx';
import './style.css';

// eslint-disable-next-line new-cap
const font = Montserrat({subsets: ['latin']});

const title = 'Simple Synth';
const description = 'Simple synthesizer built with Elementary Audio';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: title,
  },
  twitter: {
    title,
    description,
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en'>
      <body className={clsx(font.className, 'bg-gray-1 text-gray-7')}>
        {children}
      </body>
    </html>
  );
}
