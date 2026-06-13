import { defineConfig } from 'father';

export default defineConfig({
  plugins: ['@rc-component/father-plugin'],
  targets: {
    chrome: 80,
  },
  esm: {
    input: 'src',
    ignores: ['**/demo/**', '**/__tests__/**'],
  },
  cjs: {
    input: 'src/',
    ignores: ['**/demo/**', '**/__tests__/**'],
  },
  umd: {
    entry: 'src/index.ts',
    name: 'XCard',
    output: {
      path: 'dist/',
      filename: 'x-card',
    },
    sourcemap: true,
    generateUnminified: true,
    externals: {
      react: {
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
      },
    },
  },
});
