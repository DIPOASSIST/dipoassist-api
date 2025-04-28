import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    extends: [
      'eslint:recommended',
      'plugin:prettier/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
    ],
    rules: {
      // any
    },
  },
];
