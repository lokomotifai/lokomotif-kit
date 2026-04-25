import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Command, Option } from 'clipanion';
import { parse as parseYaml } from 'yaml';

import type { Module } from '@lokomotif/schema';

import { loadModuleFile } from '../lib/module-loader.js';
import { writeJson, writeLine } from '../lib/output.js';
import { findModulesDir } from '../lib/repo-root.js';

type Flow = {
  readonly name?: string;
  readonly description?: string;
  readonly modules: readonly string[];
};

const RTCSG_ORDER: Record<Module['kind'], number> = {
  role: 0,
  task: 1,
  context: 2,
  style: 3,
  guardrail: 4,
};

const RTCSG_HEADERS: Record<Module['kind'], string> = {
  role: '## Role',
  task: '## Task',
  context: '## Context',
  style: '## Style',
  guardrail: '## Guardrail',
};

export class ComposeCommand extends Command {
  static override paths = [['compose']];

  static override usage = Command.Usage({
    category: 'Flow',
    description: 'Compose a flow into a single prompt string.',
    details: `Reads a flow definition (YAML), loads each referenced module by ID, sorts them in RTCSG order (Role → Task → Context → Style → Guardrail), and emits a single prompt with section headers.

This is the CLI's local composer — sufficient for previewing and testing. Production composition logic moves to \`@lokomotif/sdk\` in Phase 4 of the implementation plan.

The flow YAML schema in v0:

\`\`\`yaml
name: example-flow
description: "Optional description."
modules:
  - roles/finance/aml-analyst
  - tasks/finance/case-review
  - guardrails/cross-industry/pii-tr
\`\`\`
`,
    examples: [
      ['Compose a flow', 'lokomotif compose flow.yaml'],
      ['JSON output', 'lokomotif compose flow.yaml --json'],
    ],
  });

  json = Option.Boolean('--json', false, { description: 'Emit JSON instead of plain prompt.' });

  rootOverride = Option.String('--root', {
    description: 'Repository root. Defaults to the current working directory.',
  });

  flowPath = Option.String({ required: true, name: 'flow.yaml' });

  async execute(): Promise<number> {
    const flowAbs = resolve(process.cwd(), this.flowPath);
    if (!existsSync(flowAbs)) {
      this.context.stderr.write(`error: flow file not found: ${flowAbs}\n`);
      return 1;
    }

    let flow: Flow;
    try {
      flow = parseYaml(readFileSync(flowAbs, 'utf-8')) as Flow;
    } catch (err: unknown) {
      this.context.stderr.write(
        `error: failed to parse flow YAML: ${err instanceof Error ? err.message : String(err)}\n`,
      );
      return 1;
    }

    if (!Array.isArray(flow.modules) || flow.modules.length === 0) {
      this.context.stderr.write('error: flow.modules must be a non-empty array of module IDs.\n');
      return 1;
    }

    const cwd = this.rootOverride ?? process.cwd();
    const modulesDir = findModulesDir(cwd);
    if (modulesDir === null) {
      this.context.stderr.write('error: no modules/ directory found.\n');
      return 1;
    }

    const loaded: Module[] = [];
    for (const id of flow.modules) {
      const path = resolveModulePath(modulesDir, id);
      if (path === null) {
        this.context.stderr.write(`error: cannot resolve module '${id}'.\n`);
        return 1;
      }
      const result = loadModuleFile(path);
      if (!result.ok) {
        this.context.stderr.write(`error: module '${id}' failed validation.\n`);
        return 1;
      }
      loaded.push(result.module);
    }

    const sorted = [...loaded].sort((a, b) => RTCSG_ORDER[a.kind] - RTCSG_ORDER[b.kind]);
    const prompt = renderPrompt(sorted, flow);

    if (this.json) {
      writeJson(this.context.stdout, {
        flow: { name: flow.name, description: flow.description },
        modules: sorted.map((m) => ({ id: m.id, kind: m.kind, version: m.version })),
        prompt,
      });
    } else {
      writeLine(this.context.stdout, prompt);
    }
    return 0;
  }
}

function resolveModulePath(modulesDir: string, id: string): string | null {
  // id format: <kind-plural>/<industry>/<name>
  // file path: <modulesDir>/<kind-plural>/<industry>/<name>.yaml
  const candidate = `${modulesDir}/${id}.yaml`;
  return existsSync(candidate) ? candidate : null;
}

function renderPrompt(modules: readonly Module[], flow: Flow): string {
  const lines: string[] = [];
  if (flow.name !== undefined) {
    lines.push(`# ${flow.name}`);
  }
  if (flow.description !== undefined) {
    lines.push('', flow.description);
  }
  for (const module of modules) {
    lines.push('', RTCSG_HEADERS[module.kind], '', `_(${module.id} v${module.version})_`);
    lines.push('', renderBody(module));
  }
  return `${lines.join('\n')}\n`;
}

function renderBody(module: Module): string {
  // For Phase 3, render the body as YAML-equivalent indented text. The
  // SDK in Phase 4 takes over with proper RTCSG composition rules.
  return JSON.stringify(module.body, null, 2);
}
