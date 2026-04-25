export type EvalPlaceholderArgs = {
  readonly id: string;
};

export function evalPlaceholder(args: EvalPlaceholderArgs): string {
  return `# Eval test placeholder for ${args.id}
#
# The eval format is finalized alongside the harness in Phase 5 of the
# implementation plan. Replace this file with a real eval definition
# when the harness ships. Until then, this placeholder marks that the
# module has acknowledged the eval-required rule.
module: ${args.id}
checks: []
`;
}
