// Lokomotif Kit — ESLint flat config (v9).
// Type-checked rules are added per-package in Phase 2 onward, where each
// package owns its tsconfig.json.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/.next/**',
      '**/.changeset/**',
      'pnpm-lock.yaml',
      'docs/**',
      'packages/eval/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Default exports are forbidden — use named exports.',
        },
      ],
    },
  },
  // Tooling configs that legitimately use default exports (vitest / eslint).
  {
    files: ['**/vitest.config.ts', '**/eslint.config.{js,mjs,cjs}'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  // Generated files are excluded from author-time rules.
  {
    files: ['**/generated/**', '**/*.generated.*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
    },
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
);
