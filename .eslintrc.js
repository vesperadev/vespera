const project = ['./packages/*/tsconfig.json', './apps/*/tsconfig.json'];

module.exports = {
  root: true,
  extends: [
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
  ],
  parserOptions: { project },
  settings: {
    'import/resolver': { typescript: { project } },
  },
  rules: {
    'unicorn/filename-case': 'off',
    'tsdoc/syntax': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'eslint-comments/require-description': 'off',
    'import/no-default-export': 'off',
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    'import/no-cycle': 'off',
  },
};
