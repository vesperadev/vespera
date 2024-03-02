import { DocsLayout } from 'fumadocs-ui/layout';
import { LayoutTemplate } from 'lucide-react';
import type { ReactNode } from 'react';

import { create } from '@/components/ui/icon';
import { docs } from '@/lib/source';

export default function RootDocsLayout({ children, params }: { children: ReactNode; params: { slug: string[] } }) {
  const tree = docs.pageTree.children.reduce<typeof docs.pageTree>(
    (acc, page) => {
      if (page.type === 'folder') {
        const name = page.name.toLowerCase();

        if (name.startsWith(params.slug[0])) {
          acc.children = page.children;
        }
      }

      return acc;
    },
    {
      name: 'Vespera',
      children: [],
    },
  );

  return (
    <DocsLayout
      tree={tree}
      nav={{
        githubUrl: 'https://github.com/vesperadev/vespera',
        title: 'Vespera',
        transparentMode: 'always',
      }}
      sidebar={{
        defaultOpenLevel: 0,
      }}
      links={[
        {
          text: 'Templates',
          url: '/templates',
          icon: create({ icon: LayoutTemplate }),
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
