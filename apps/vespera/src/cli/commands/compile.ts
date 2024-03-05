// @ts-expect-error - ignore import
import * as p from '@clack/prompts';
import { Command } from 'commander';
import { build } from 'esbuild';
import color from 'picocolors';

import { getConfig } from '../utils/config';
import { defaultConfig } from '..';
import { watchConfig } from 'c12';

export const compile = new Command()
  .name('compile')
  .description('Compile the project')
  .option('-w, --watch', 'watch for changes')
  .action(async () => {
    const commandOptions = compile.opts() as { watch?: boolean };

    console.clear();
    const time = new Date();

    p.intro(color.bgRed(color.black(' Vespera - Build Discord Bots with ease ')));

    try {
      const config = await getConfig();

      const spinner = p.spinner();
      spinner.start('loading config file');

      if (!config) {
        spinner.stop('config file not found');
        return;
      }

      const options = config.esbuild;
      if (!options) {
        spinner.stop('esbuild config empty');
        return;
      }

      if (defaultConfig.esbuild)
        options.plugins = [...(options.plugins ?? []), ...(defaultConfig.esbuild.plugins ?? [])];

      const output = await build(options);
      spinner.stop('compiled successfully');

      const perf = new Date().getTime() - time.getTime();

      const messages = [
        `Compiled in: ${color.red(perf + 'ms')}`,
        `Output: ${color.red(`${options.outdir}/` ?? options.outfile)}`,
        `Output Size: ${color.bgRed(
          color.black(
            `${Math.floor(
              (Object.values(output.metafile?.outputs ?? {}) ?? []).reduce<number>((acc, file) => acc + file.bytes, 0) /
                1024 /
                1024,
            )}~ MB`,
          ),
        )}`,
      ];

      commandOptions.watch ? p.log.success(messages.join(' - ')) : p.outro(messages.join(' - '));

      if (commandOptions.watch) {
        p.log.info('Watching for changes...');

        await watchConfig({
          configFile: 'vespera.config',
          dotenv: true,
          name: 'vespera',

          overrides: {
            ...config,
            esbuild: {
              metafile: true,
            },
          },

          defaultConfig: config,

          acceptHMR: ({ getDiff }) => {
            const diff = getDiff();
            if (diff.length === 0) {
              p.log.info('Config file updated, no changes detected');
              return true;
            }
          },

          onUpdate: async ({ newConfig }) => {
            const now = new Date();

            p.log.info('Config file updated, changes detected, compiling again');

            const newOptions = newConfig.config?.esbuild || options;
            const output = await build(newOptions);

            const perf = new Date().getTime() - now.getTime();

            const messages = [
              `Compiled in: ${color.red(perf + 'ms')}`,
              `Output: ${color.red(`${options.outdir}/` ?? options.outfile)}`,
              `Output Size: ${color.bgRed(
                color.black(
                  `${Math.floor(
                    (Object.values(output.metafile?.outputs ?? {}) ?? []).reduce<number>(
                      (acc, file) => acc + file.bytes,
                      0,
                    ) /
                      1024 /
                      1024,
                  )}~ MB`,
                ),
              )}`,
            ];

            p.log.success(messages.join(' - '));
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
