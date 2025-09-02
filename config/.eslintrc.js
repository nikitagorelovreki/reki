module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: ['eslint:recommended'],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.min.js',
    'packages/*/dist/**/*',
    'Flower Form/**/*',
    '**/*.ts',
    '**/*.tsx',
  ],
  rules: {
    // Add any root-level rules here
  },
};
