module.exports = {
  // Basic formatting
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  
  // Spacing and indentation
  tabWidth: 2,
  useTabs: false,
  
  // Line length and wrapping
  printWidth: 80,
  
  // Object and array formatting
  bracketSpacing: true,
  bracketSameLine: false,
  
  // Arrow functions
  arrowParens: 'avoid',
  
  // JSX specific
  jsxSingleQuote: true,
  
  // Ending
  endOfLine: 'lf',
  
  // Language specific overrides
  overrides: [
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        semi: true,
        singleQuote: true,
      },
    },
    {
      files: '*.{md,json}',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.{yaml,yml}',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
};