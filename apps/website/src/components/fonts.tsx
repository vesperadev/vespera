import { Lilita_One, Poppins, Ubuntu_Mono } from 'next/font/google';
import type { FC, ReactNode } from 'react';

const display = Lilita_One({
  display: 'swap',
  weight: '400',
  preload: true,
  subsets: ['latin'],
  variable: '--font-display',
});

const prose = Poppins({
  display: 'swap',
  weight: '500',
  preload: true,
  subsets: ['latin'],
  variable: '--font-prose',
});

const code = Ubuntu_Mono({
  display: 'swap',
  weight: '400',
  preload: true,
  subsets: ['latin'],
  variable: '--font-code',
});

export const FontProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const fonts = [display, prose, code];

  return <div className={fonts.map((font) => font.className).join(' ')}>{children}</div>;
};
