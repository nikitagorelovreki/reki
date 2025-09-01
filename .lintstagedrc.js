export default {
  // TypeScript and JavaScript files
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],

  // JSON files
  '*.json': [
    'prettier --write',
  ],

  // Markdown files
  '*.md': [
    'prettier --write',
  ],

  // YAML files
  '*.{yml,yaml}': [
    'prettier --write',
  ],

  // CSS/SCSS files
  '*.{css,scss,sass,less}': [
    'prettier --write',
  ],

  // Package.json files specifically
  'package.json': [
    'prettier --write',
  ],

  // TypeScript type checking for specific packages
  'packages/frontend/**/*.{ts,tsx}': () => [
    'tsc --noEmit --project packages/frontend/tsconfig.app.json',
  ],
  
  'packages/api-server/**/*.ts': () => [
    'tsc --noEmit --project packages/api-server/tsconfig.json',
  ],
};