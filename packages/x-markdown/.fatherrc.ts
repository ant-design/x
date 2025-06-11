import { codecovWebpackPlugin } from '@codecov/webpack-plugin';
import DuplicatePackageCheckerPlugin from '@madccc/duplicate-package-checker-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import { defineConfig } from 'father';

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
    overrides: {
      'src/plugins': {
        output: 'plugins',
      },
    },
  },
  cjs: {
    input: 'src',
  },
  umd: {
    entry: {
      'src/index.ts': {
        name: 'antdxMarkdown',
        output: {
          path: 'dist/',
          filename: 'antdx-markdown',
        },
      },
      'src/plugins/CodeHighLight/index.tsx': {
        name: 'antdxCodeHighlight',
        output: {
          path: 'dist/',
          filename: 'antdx-code-high-light',
        },
      },
      'src/plugins/Latex/index.ts': {
        name: 'antdxLatex',
        output: {
          path: 'dist/',
          filename: 'antdx-latex',
        },
      },
    },
    sourcemap: true,
    generateUnminified: true,
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      '@ant-design/cssinjs': 'antdCssinjs',
      antd: 'antd',
    },
    transformRuntime: {
      absoluteRuntime: process.cwd(),
    },
    chainWebpack: (memo, { env }) => {
      if (env === 'production') {
        memo.plugin('codecov').use(CodecovWebpackPlugin, [
          {
            enableBundleAnalysis: true,
            bundleName: 'antdxmarkdown',
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
