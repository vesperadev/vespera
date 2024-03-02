import defaultComponents from 'fumadocs-ui/mdx';
import { Popup, PopupContent, PopupTrigger } from 'fumadocs-ui/twoslash/popup';
import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...components,
    Popup,
    PopupContent,
    PopupTrigger,

    // @ts-expect-error - ignore
    a: Link,
  };
}
