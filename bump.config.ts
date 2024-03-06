import { defineConfig } from 'bumpp';

export default defineConfig({
  commit: true,
  all: true,
  release: 'prompt',
  cwd: './apps/vespera',
  tag: true,
});
