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
    ignores: ['**/__tests__/**'],
    overrides: {
      'src/plugins': {
        output: 'plugins',
      },
      'src/themes': {
        output: 'themes',
      },
    },
  },
  cjs: {
    ignores: ['**/__tests__/**'],
    input: 'src',
  },
  umd: {
    entry: {
      'src/index.ts': {
        name: 'XMarkdown',
        sourcemap: true,
        generateUnminified: true,
        output: {
          path: 'dist/',
          filename: 'x-markdown',
        },
      },
      'src/plugins/HighlightCode/index.tsx': {
        name: 'HighlightCode',
        sourcemap: true,
        generateUnminified: true,
        output: {
          path: 'dist/plugins',
          filename: 'code-high-light',
        },
      },
      'src/plugins/Latex/index.ts': {
        name: 'Latex',
        sourcemap: true,
        generateUnminified: true,
        output: {
          path: 'dist/plugins',
          filename: 'latex',
        },
      },
      'src/plugins/Mermaid/index.tsx': {
        name: 'Mermaid',
        sourcemap: true,
        generateUnminified: true,
        output: {
          path: 'dist/plugins',
          filename: 'mermaid',
        },
      },
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      '@ant-design/cssinjs': 'antdCssinjs',
    },
    transformRuntime: {
      absoluteRuntime: process.cwd(),
    },
    chainWebpack: (memo, { env }) => {
      if (env === 'production') {
        memo.plugin('codecov').use(CodecovWebpackPlugin, [
          {
            enableBundleAnalysis: true,
            bundleName: 'x-markdown',
            uploadToken: process.env.CODECOV_TOKEN,
            gitService: 'github',
          },
        ]);
        memo.plugin('circular-dependency-checker').use(CircularDependencyPlugin, [
          {
            failOnError: true,
            exclude: /node_modules[\\/](chevrotain|d3-.*|langium)/,
          },
        ]);
        memo.plugin('duplicate-package-checker').use(DuplicatePackageCheckerPlugin, [
          {
            verbose: true,
            emitError: true,
            exclude: (instance: any) => {
              // 排除特定包
              if (
                instance.name === 'cose-base' ||
                instance.name === 'layout-base' ||
                instance.name.startsWith('d3-') ||
                instance.name === 'internmap'
              ) {
                return true;
              }

              return false;
            },
          },
        ]);
      }
      return memo;
    },
  },
});
