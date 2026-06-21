import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    extends: [
      //
      eslintPluginPrettierRecommended,
      pluginJs.configs.recommended,
      unicorn.configs.all,
    ],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'unicorn/filename-case': [
        'error',
        { case: 'pascalCase', checkDirectories: false, ignore: ['index.js', 'eslint.config.js'] },
      ],
      'unicorn/no-asterisk-prefix-in-documentation-comments': 'off',

      'prettier/prettier': [
        'error',
        {
          printWidth: 120,
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],
    },
  },
]);
