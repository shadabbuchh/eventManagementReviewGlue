import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'eslint.config.js',
      'src/types/template-placeholders.d.ts',
      'src/repositories/__entity__.repo.template.ts',
      // Ignore all template files (including tests) from linting/type-checking
      '**/*.template.ts',
      'tests/**/*.template.ts',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // Disallow any
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      // Forbid .js extensions in TS imports
      'import/extensions': [
        'error',
        'ignorePackages',
        { ts: 'never', tsx: 'never', js: 'never' },
      ],
      // Import plugin rules
      'unused-imports/no-unused-imports': 'error',
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',
      'import/no-duplicates': 'warn',
      // TypeScript rules
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      'no-console': 'off',
      // Prevent redeclaring repositories in subclasses; use BaseService field
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "ClassDeclaration[id.name!='BaseService'] PropertyDefinition[key.name='repositories']",
          message:
            "Do not declare 'repositories' in subclasses; use BaseService's field.",
        },
      ],
    },
  }
);
