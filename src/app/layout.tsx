import {type Metadata} from 'next';
import {Montserrat} from 'next/font/google';
import clsx from 'clsx';
import './style.css';

// eslint-disable-next-line new-cap
const font = Montserrat({subsets: ['latin']});

const title = 'ADSR';
const description = 'ADSR - simple synthesizer built with Elementary Audio';
const images = [
  {
    url: '/og-image.png',
    alt: description,
    width: 1200,
    height: 630,
  },
];

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: title,
    images,
  },
  twitter: {
    title,
    description,
    images,
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en'>
      <body className={clsx(font.className, 'bg-gray-0 text-gray-7')}>
        {children}
      </body>
    </html>
  );
}
