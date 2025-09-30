import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import zustandRules from './lint-rules/eslint-plugin-zustand-rules/index.js';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,
  {
    ignores: ['dist/**', 'eslint.config.js', 'lint-rules/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'zustand-rules': zustandRules,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json',
        },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        { ts: 'never', tsx: 'never', js: 'never' },
      ],
      // Custom rules
      'zustand-rules/no-object-selectors': 'error',
      // Enforce consistent type imports to prevent verbatimModuleSyntax errors
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      // Ensure type-only imports are marked as type-only
      '@typescript-eslint/no-import-type-side-effects': 'error',
      // Disallow the use of variables before they are defined
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'error',
      // Allow shadcn UI components to export utilities alongside components
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowExportNames: [
            'cn',
            'buttonVariants',
            'badgeVariants',
            'toggleVariants',
            'navigationMenuTriggerStyle',
          ],
        },
      ],
      // Import plugin rules
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',
      'import/no-duplicates': 'warn',
      'react-hooks/react-compiler': 'error',
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
  },
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'react-hooks/react-compiler': 'off',
    },
  }
);
