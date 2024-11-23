import { codecovWebpackPlugin } from '@codecov/webpack-plugin';
import { defineConfig } from 'father';

class CodecovWebpackPlugin {
  private options;
  constructor(options = {}) {
    this.options = {
      enableBundleAnalysis: true,
      bundleName: 'webpack-bundle',
      gitService: 'github',
      disable: false,
      ...options,
    };
  }
  apply(compiler: any) {
    return codecovWebpackPlugin(this.options).apply(compiler);
  }
}

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
    chainWebpack: (memo) => {
      if (process.env.NODE_ENV === 'production') {
        memo.plugin('codecov').use(CodecovWebpackPlugin, [
          {
            enableBundleAnalysis: true,
            bundleName: 'antdx',
            uploadToken: process.env.CODECOV_TOKEN,
            gitService: 'github',
          },
        ]);
      }
      return memo;
    },
  },
});
