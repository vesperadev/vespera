import { createSearchAPI } from 'fumadocs-core/search/server';

import { docs } from '@/lib/source';

export const { GET } = createSearchAPI('advanced', {
  indexes: docs.getPages().map((page) => ({
    id: page.url,
    title: page.data.title,
    structuredData: page.data.exports.structuredData,
    url: `/docs/${page.slugs.join('/')}`,
    slugs: page.slugs,
  })),
});
