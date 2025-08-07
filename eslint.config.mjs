import typescriptEslint from '@typescript-eslint/eslint-plugin';
import checkFile from 'eslint-plugin-check-file';
import importPlugin from 'eslint-plugin-import';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['coverage/', 'src/__generated__/**/*', 'src/db/seed/**'],
  },
  {
    files: ['./src/**/*.ts'],
    ignores: ['tests/**/*'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'check-file': checkFile,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      quotes: ['error', 'single'],
      curly: ['error', 'all'],

      'no-console': 'error',

      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.ts': 'KEBAB_CASE',
        },
        { ignoreMiddleExtensions: true },
      ],

      // Enforce a consistent order of import statements
      'import/order': [
        'warn',
        {
          groups: [
            'builtin', // e.g. fs, path
            'external', // e.g. lodash
            'internal', // your aliases
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {
              pattern: '@webapi/**',
              group: 'internal',
            },
            {
              pattern: '@repo/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];
