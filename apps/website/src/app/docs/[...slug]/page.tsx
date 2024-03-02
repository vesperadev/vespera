import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { docs } from '@/lib/source';

export const dynamicParams = false;

export default async function Page({ params }: { params: { slug: string[] } }) {
  const pages = docs.getPages();

  const slug = [params.slug[0].replaceAll('.', '-'), ...params.slug.slice(1)];
  const page = pages.find((page) => page.slugs.join('/') === slug.join('/'));

  if (!page) {
    notFound();
  }

  const MDX = page.data.exports.default;

  return (
    <DocsPage toc={page.data.exports.toc}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return docs.getPages().map((page) => ({
    slug: page.slugs,
  }));
}

export function generateMetadata({ params }: { params: { slug: string[] } }) {
  const pages = docs.getPages();

  const slug = [params.slug[0].replaceAll('.', '-'), ...params.slug.slice(1)];
  const page = pages.find((page) => page.slugs.join('/') === slug.join('/'));

  if (!page) {
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}
