import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic/js': stylistic,
    },
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    rules: {
      '@stylistic/js/semi': ['error', 'always'],
      '@stylistic/js/block-spacing': ['error', 'always'],
      '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/js/no-mixed-operators': 'off',
      '@stylistic/js/lines-around-comment': [
        'error',
        {
          beforeBlockComment: false,
          allowBlockStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
        },
      ],
      '@stylistic/js/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: ['return', 'export', 'function'],
        },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-unexpected-multiline': 'error',
      'no-var': 'error',
      'no-unsafe-optional-chaining': 'error',
      curly: ['error', 'all'],
      'arrow-body-style': ['error', 'as-needed'],
      'no-sparse-arrays': ['off'],
      'prettier/prettier': [
        'error',
        {
          printWidth: 120,
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],
    },
    files: ['{*,**/*}.{js,cjs,mjs,ts,vue}'],
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
    files: ['{*,**/*}.{js,mjs,ts,vue}'],
  },
  {
    languageOptions: {
      globals: globals.node,
    },
    files: ['{*,**/*}.cjs'],
  },
];
