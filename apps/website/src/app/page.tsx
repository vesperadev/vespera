import { Section } from '@radix-ui/themes';
import { DocsLayout } from 'fumadocs-ui/layout';
import { LayoutTemplate } from 'lucide-react';

import { create } from '@/components/ui/icon';

import { docs } from '../lib/source';

export default function Home() {
  return (
    <main>
      <DocsLayout
        tree={docs.pageTree}
        nav={{
          githubUrl: 'https://github.com/vesperadev/vespera',
          title: 'Vespera',
          transparentMode: 'always',
        }}
        sidebar={{
          defaultOpenLevel: 0,
          enabled: false,
        }}
        links={[
          {
            text: 'Templates',
            url: '/templates',
            icon: create({ icon: LayoutTemplate }),
          },
        ]}
      >
        <Section></Section>
      </DocsLayout>
    </main>
  );
}
