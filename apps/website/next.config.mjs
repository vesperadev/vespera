import {
  rehypeCode,
  rehypeCodeDefaultOptions,
  remarkGfm,
  remarkHeading,
} from 'fumadocs-core/mdx-plugins';
import createMDX from 'fumadocs-mdx/config';
import { transformerTwoslash } from 'fumadocs-twoslash';

const withMDX = createMDX({
  rootContentPath: 'content/',
  mdxOptions: {
    format: 'mdx',
    rehypePlugins: [remarkHeading, remarkGfm, rehypeCode],
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      theme: 'poimandres',
      transformers: [
        ...rehypeCodeDefaultOptions.transformers,
        transformerTwoslash({
          onTwoslashError: () => {},
        }),
      ],
    },
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: () => {
    return [
      {
        source: '/docs',
        destination: '/docs/readme',
      },
    ];
  },
};

function withPlugins(plugins) {
  return plugins.reduce((acc, plugin) => plugin(acc), {
    ...nextConfig,
  });
}

export default withPlugins([withMDX]);
