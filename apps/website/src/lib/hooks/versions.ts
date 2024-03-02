import { docs } from '../source';

export const useVersions = () => {
  return docs.pageTree.children
    .filter((page) => page.type === 'folder' && page.name.toLowerCase().startsWith('v'))
    .map((page) => page.name.toLowerCase());
};

export const useVersion = (version: string) => {
  return docs.pageTree.children.filter((page) => page.type === 'folder' && page.name.toLowerCase().startsWith(version));
};
