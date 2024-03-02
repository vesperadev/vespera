import type { Metadata } from 'next';

import 'fumadocs-ui/twoslash.css';
import '@radix-ui/themes/styles.css';
import '../styles/globals.css';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Vespera',
  description: 'The best discord interactions lib out there',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
