import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import noDomainImports from './eslint-rules/no-domain-imports.js';

export default tseslint.config([
  // Global ignores
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/build/**',
      '**/*.d.ts',
      '**/public/**',
      '**/.turbo/**',
      '**/docker-compose*',
      '**/Dockerfile*',
      '**/*.config.js',
      '**/*.config.ts',
    ],
  },

  // Base configuration for all TypeScript files
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      'prefer-const': 'error',

      // Import/export rules
      'no-duplicate-imports': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],

      // General code quality
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-unreachable': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      // Formatting (handled by Prettier but good to have as backup)
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],

      // Best practices
      eqeqeq: ['error', 'always'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',
    },
  },

  // Frontend (React) specific configuration
  {
    files: ['packages/frontend/**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // React specific rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // React hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // JSX rules
      'jsx-quotes': ['error', 'prefer-single'],

      // Frontend specific overrides
      'no-console': 'warn', // Allow console in development
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Backend (NestJS) specific configuration
  {
    files: [
      'packages/app-core-server/**/*.ts',
      'packages/use-cases/**/*.ts',
      'packages/persistence/**/*.ts',
      'packages/api/**/*.ts',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      'no-domain-imports': noDomainImports,
    },
    rules: {
      // Architecture rules
      'no-domain-imports/no-domain-imports': 'error',

      // NestJS specific rules
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',

      // Class validation rules (for DTOs and entities)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Backend specific overrides
      'no-console': 'off', // Allow console.log in backend for logging
    },
  },

  // Domain layer specific rules (stricter)
  {
    files: ['packages/domain/**/*.ts'],
    rules: {
      // Domain should be pure and explicit
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      'no-console': 'error',

      // Ensure immutability patterns (requires type information)
      // '@typescript-eslint/prefer-readonly': 'warn',
    },
  },

  // Test files
  {
    files: ['**/*.{test,spec}.{ts,tsx,js,jsx}', '**/test/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      // Allow any and console in tests
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  // Configuration files
  {
    files: ['**/*.config.{js,ts}', '**/vite.config.ts', '**/nest-cli.json'],
    rules: {
      // More relaxed rules for config files
      'no-console': 'off',
    },
  },
]);
