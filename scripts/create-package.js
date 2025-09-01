#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const PACKAGES_DIR = path.join(__dirname, '..', 'packages');

async function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createPackage() {
  console.log('\n===== CUIS Package Generator =====\n');
  
  const packageName = await prompt('Enter package name (e.g., "notifications"): ');
  if (!packageName || packageName.trim() === '') {
    console.error('Error: Package name is required');
    rl.close();
    return;
  }
  
  const fullName = `@cuis/${packageName}`;
  const description = await prompt('Enter package description: ');
  const packageDir = path.join(PACKAGES_DIR, packageName);
  
  // Check if directory already exists
  if (fs.existsSync(packageDir)) {
    console.error(`Error: Package directory already exists: ${packageDir}`);
    rl.close();
    return;
  }
  
  // Create directories
  fs.mkdirSync(packageDir);
  fs.mkdirSync(path.join(packageDir, 'src'));
  fs.mkdirSync(path.join(packageDir, 'test'));
  
  // Create package.json
  const packageJson = {
    name: fullName,
    version: '0.1.0',
    description: description || `${packageName} module for CUIS`,
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    scripts: {
      build: 'tsc',
      test: 'jest',
      lint: 'eslint src/**/*.ts',
      clean: 'rimraf dist'
    },
    files: ['dist'],
    publishConfig: {
      access: 'restricted'
    },
    dependencies: {},
    peerDependencies: {},
    devDependencies: {
      typescript: '^5.1.3',
      jest: '^29.5.0',
      'ts-jest': '^29.1.0',
      '@types/jest': '^29.5.2',
      eslint: '^8.42.0',
      '@typescript-eslint/eslint-plugin': '^5.59.11',
      '@typescript-eslint/parser': '^5.59.11',
      rimraf: '^5.0.1'
    }
  };
  
  // Ask about dependencies
  console.log('\nSelect dependencies (y/n):');
  
  if (await prompt('Include @cuis/domain? (y/n): ') === 'y') {
    packageJson.dependencies['@cuis/domain'] = '^0.1.0';
  }
  
  if (await prompt('Include @cuis/use-cases? (y/n): ') === 'y') {
    packageJson.dependencies['@cuis/use-cases'] = '^0.1.0';
  }
  
  if (await prompt('Include @cuis/persistence? (y/n): ') === 'y') {
    packageJson.dependencies['@cuis/persistence'] = '^0.1.0';
  }
  
  if (await prompt('Include NestJS? (y/n): ') === 'y') {
    packageJson.peerDependencies['@nestjs/common'] = '^10.0.0';
    packageJson.peerDependencies['@nestjs/core'] = '^10.0.0';
    packageJson.devDependencies['@nestjs/common'] = '^10.0.0';
    packageJson.devDependencies['@nestjs/core'] = '^10.0.0';
  }
  
  // Write package.json
  fs.writeFileSync(
    path.join(packageDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'CommonJS',
      rootDir: './src',
      outDir: './dist',
      declaration: true,
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      experimentalDecorators: true,
      emitDecoratorMetadata: true
    },
    include: ['src/**/*.ts'],
    exclude: ['node_modules', 'dist', 'test']
  };
  
  fs.writeFileSync(
    path.join(packageDir, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2)
  );
  
  // Create index.ts
  fs.writeFileSync(
    path.join(packageDir, 'src', 'index.ts'),
    '// Export public API here\n'
  );
  
  console.log(`\n✅ Package ${fullName} created successfully at ${packageDir}`);
  console.log('\nNext steps:');
  console.log('1. Add your code to src/');
  console.log('2. Run "npm install" to update dependencies');
  console.log('3. Run "npm run build -w ' + fullName + '" to build the package');
  
  rl.close();
}

createPackage().catch(err => {
  console.error('Error creating package:', err);
  rl.close();
});
