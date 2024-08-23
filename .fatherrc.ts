import { defineConfig } from 'father';

export default defineConfig({
  plugins: ['@rc-component/father-plugin'],
  esm: {
    input: 'components/',
    ignores: ['**/demo/**', '**/__tests__/**'],
    targets: {
      chrome: 80,
    },
  },
  cjs: {
    input: 'components/',
    ignores: ['**/demo/**', '**/__tests__/**'],
    targets: {
      chrome: 80,
    },
  },
  umd: {
    entry: 'components/index.ts',
    name: 'antdx',
    output: {
      path: 'dist/',
      filename: 'antdx',
    },
    sourcemap: true,
    generateUnminified: true,
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      '@ant-design/cssinjs': 'antdCssinjs',
      antd: 'antd',
    },
  },
});
