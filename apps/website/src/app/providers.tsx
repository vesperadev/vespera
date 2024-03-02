'use client';

import { Theme } from '@radix-ui/themes';
import { RootProvider } from 'fumadocs-ui/provider';
import type { FC } from 'react';

import { FontProvider } from '@/components/fonts';

export const Providers: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Theme accentColor="red" grayColor="sage">
      <RootProvider>
        <FontProvider>{children}</FontProvider>
      </RootProvider>
    </Theme>
  );
};
