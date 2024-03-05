import { Command } from 'commander';

import { compile } from './commands/compile.js';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

async function main() {
  const program = new Command()
    .name('vespera')
    .description('A tool to help you manage your vespera projects')
    .version('0.1.0', '-v, --version', 'display the version number');

  program.addCommand(compile);

  program.parse();
}

main();
