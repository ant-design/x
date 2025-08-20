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
    input: 'src',
  },
  cjs: {
    input: 'src',
  },
  umd: {
    entry: 'src/index.ts',
    name: 'XSdk',
    bundler: 'utoopack',
    rootPath: path.resolve(__dirname, '../../'),
    output: {
      path: 'dist/',
      filename: 'x-sdk',
    },
    sourcemap: true,
    generateUnminified: true,
    concatenateModules: true,
    externals: {
      react: {
        root: 'React',
        commonjs: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs: 'react-dom',
      },
      '@ant-design/cssinjs': {
        root: 'antdCssinjs',
        commonjs: 'antdCssinjs',
      },
      '@ant-design/icons': {
        root: 'icons',
        commonjs: 'icons',
      },
      dayjs: {
        root: 'dayjs',
        commonjs: 'dayjs',
      },
      antd: {
        root: 'antd',
        commonjs: 'antd',
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
            bundleName: 'antdxsdk',
            uploadToken: process.env.CODECOV_TOKEN,
            gitService: 'github',
          },
        ]);
        memo.plugin('circular-dependency-checker').use(CircularDependencyPlugin, [
          {
            failOnError: true,
          },
        ]);
        memo.plugin('duplicate-package-checker').use(DuplicatePackageCheckerPlugin, [
          {
            verbose: true,
            emitError: true,
          },
        ]);
      }
      return memo;
    },
  },
});
