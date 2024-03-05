import type { BuildOptions } from 'esbuild';
import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';

export interface VesperaConfig {
  application: {
    id: string;
    publicKey: string;
  };
  token: string;
  esbuild?: BuildOptions;
}

/**
 * This TypeScript function defines a configuration object for Vespera.
 * @param {VesperaConfig} config - The `config` parameter in the `defineConfig` function is of type
 * `VesperaConfig`. It is an object that contains configuration settings for the Vespera application.
 * @returns {VesperaConfig} The `config` object is being returned.
 */
export function defineConfig(config: VesperaConfig): VesperaConfig {
  return config;
}

export const defaultConfig: Partial<VesperaConfig> = {
  esbuild: {
    bundle: true,
    format: 'esm',
    minify: true,
    sourcemap: true,
    outdir: 'dist',
    treeShaking: true,
    platform: 'browser',
    target: 'esnext',
    metafile: true,
    plugins: [
      nodeModulesPolyfillPlugin({
        modules: {
          url: true,
          util: true,
          events: true,
          path: true,
        },
      }),
    ],
  },
};
