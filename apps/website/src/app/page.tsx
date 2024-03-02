import { create } from '@/components/ui/icon';
import { DocsLayout } from 'fumadocs-ui/layout';
import { LayoutTemplate } from 'lucide-react';
import { docs } from '../lib/source';
import { Section } from '@radix-ui/themes';

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
