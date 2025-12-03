import { codecovWebpackPlugin } from '@codecov/webpack-plugin';
import DuplicatePackageCheckerPlugin from '@madccc/duplicate-package-checker-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import { defineConfig } from 'father';
import path from 'path';

class CodecovWebpackPlugin {
  private options;
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler: any) {
    return codecovWebpackPlugin(this.options).apply(compiler);
  }
}

export default defineConfig({
  plugins: ['@rc-component/father-plugin'],
  targets: {
    chrome: 80,
  },
  esm: {
    input: 'components',
    ignores: ['**/demo/**', '**/__tests__/**'],
    overrides: {
      'components/locale': {
        output: 'locale',
      },
    },
  },
  cjs: {
    input: 'components/',
    ignores: ['**/demo/**', '**/__tests__/**'],
  },
  umd: {
    entry: 'components/index.ts',
    name: 'antdx',
    bundler: 'webpack',
    output: {
      path: 'dist/',
      filename: 'antdx',
    },
    sourcemap: true,
    generateUnminified: true,
    concatenateModules: false,
    rootPath: path.resolve(__dirname, '../../'),
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
      '@ant-design/cssinjs': {
        root: 'antdCssinjs',
        commonjs: 'antdCssinjs',
        commonjs2: 'antdCssinjs',
      },
      '@ant-design/icons': {
        root: 'icons',
        commonjs: 'icons',
        commonjs2: 'icons',
      },
      dayjs: {
        root: 'dayjs',
        commonjs: 'dayjs',
        commonjs2: 'dayjs',
      },
      antd: {
        root: 'antd',
        commonjs: 'antd',
        commonjs2: 'antd',
      },
    },
    transformRuntime: {
      absoluteRuntime: process.cwd(),
    },
    chainWebpack: (memo, { env }) => {
      if (env === 'production') {
        memo.plugin('codecov').use(CodecovWebpackPlugin, [
          {
            enableBundleAnalysis: true,
            bundleName: 'antdx',
            uploadToken: process.env.CODECOV_TOKEN,
            gitService: 'github',
          },
        ]);
        memo.plugin('circular-dependency-checker').use(CircularDependencyPlugin, [
          {
            failOnError: true,
            // mermaid
            exclude: /node_modules[\\/](chevrotain|d3-.*|langium)/,
          },
        ]);
        memo.plugin('duplicate-package-checker').use(DuplicatePackageCheckerPlugin, [
          {
            verbose: true,
            emitError: true,
            // mermaid
            exclude: ({ name }) =>
              ['cose-base', 'layout-base', 'internmap'].includes(name) || name.startsWith('d3-'),
          },
        ]);
      }
      return memo;
    },
  },
});
