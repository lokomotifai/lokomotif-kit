/**
 * Commitlint configuration — enforces Conventional Commits at commit-msg time.
 *
 * Wired through the pre-commit framework (`.pre-commit-config.yaml`).
 * Operators install the hook with `pre-commit install` once; the
 * `default_install_hook_types` in that file pulls in commit-msg too.
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow the standard Conventional Commits type set. Keep this list
    // explicit so accidentally novel types ('feat-x', 'wip') fail loud.
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'refactor',
        'test',
        'build',
        'ci',
        'perf',
        'style',
        'revert',
      ],
    ],
    // Subject case is enforced softly elsewhere (review). Don't fail
    // commits for case alone.
    'subject-case': [0],
    // Permissive header length — phase commits carry meaningful subjects.
    'header-max-length': [1, 'always', 100],
    // Body lines should wrap at 100 chars.
    'body-max-line-length': [2, 'always', 100],
  },
};
