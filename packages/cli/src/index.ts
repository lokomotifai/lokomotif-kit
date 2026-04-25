/**
 * @lokomotif/cli — main entry point.
 *
 * Composes the clipanion CLI from individual command classes and runs
 * it. Imported by the bin shim at `bin/lokomotif.js`. Importable as a
 * library too: `import { buildCli } from '@lokomotif/cli'`.
 */

import { Builtins, Cli } from 'clipanion';

import { ComposeCommand } from './commands/compose.js';
import { DeployCommand } from './commands/deploy.js';
import { EvalRunCommand } from './commands/eval-run.js';
import { ModulesListCommand } from './commands/modules-list.js';
import { ModulesNewCommand } from './commands/modules-new.js';
import { ModulesValidateCommand } from './commands/modules-validate.js';
import { VERSION } from './version.js';

export function buildCli(): Cli {
  const cli = new Cli({
    binaryLabel: 'Lokomotif Kit CLI',
    binaryName: 'lokomotif',
    binaryVersion: VERSION,
  });

  cli.register(Builtins.HelpCommand);
  cli.register(Builtins.VersionCommand);
  cli.register(ModulesListCommand);
  cli.register(ModulesValidateCommand);
  cli.register(ModulesNewCommand);
  cli.register(ComposeCommand);
  cli.register(EvalRunCommand);
  cli.register(DeployCommand);

  return cli;
}

export {
  ComposeCommand,
  DeployCommand,
  EvalRunCommand,
  ModulesListCommand,
  ModulesNewCommand,
  ModulesValidateCommand,
};
export { VERSION };

// Auto-run when invoked as a script (the common case via the bin shim).
// Importing the module as a library does not trigger this — the
// detection guards on `import.meta.url` matching the entry point.
const isMain = process.argv[1] !== undefined && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMain || process.argv[1]?.endsWith('lokomotif.js') === true) {
  void buildCli().runExit(process.argv.slice(2));
}
