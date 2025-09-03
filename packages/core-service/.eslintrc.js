module.exports = {
  extends: [
    'eslint:recommended',
  ],
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.js', 'dist/**/*', 'node_modules/**/*', '**/*.ts', '**/*.tsx'],
  rules: {
    // TypeScript files are ignored - use tsc for type checking
  },
};