import { loadConfig } from 'c12';

import { defaultConfig, type VesperaConfig } from '..';

export async function getConfig() {
  const config = await loadConfig<VesperaConfig>({
    configFile: 'vespera.config',
    dotenv: true,
    name: 'vespera',

    // @ts-expect-error - ignore for now
    overrides: {
      esbuild: {
        metafile: true,
      },
    },

    // @ts-expect-error - ignore for now
    defaultConfig: defaultConfig,
  });

  return config.config;
}
