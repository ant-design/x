/* eslint no-param-reassign: 0 */
// This config is for building dist files
const getWebpackConfig = require('@ant-design/tools/lib/getWebpackConfig');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { EsbuildPlugin } = require('esbuild-loader');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const DuplicatePackageCheckerPlugin = require('@madccc/duplicate-package-checker-webpack-plugin');
const browserslist = require('browserslist');
const browserslistToEsbuild = require('browserslist-to-esbuild');
const path = require('path');

const targets = browserslistToEsbuild(browserslist());

function addLocales(webpackConfig) {
  let packageName = 'antd-with-locales';
  if (webpackConfig.entry['antd.min']) {
    packageName += '.min';
  }
  webpackConfig.entry[packageName] = './index-with-locales.js';
  webpackConfig.output.filename = '[name].js';
}

function externalDayjs(config) {
  config.externals.dayjs = {
    root: 'dayjs',
    commonjs2: 'dayjs',
    commonjs: 'dayjs',
    amd: 'dayjs',
  };
}

function externalCssinjs(config) {
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};

  config.resolve.alias['@ant-design/cssinjs'] = path.resolve(__dirname, 'alias/cssinjs');
}

let webpackConfig = getWebpackConfig(false);

// Used for `size-limit` ci which only need to check min files
if (process.env.PRODUCTION_ONLY) {
  // eslint-disable-next-line no-console
  console.log('🍐 Build production only');
  webpackConfig = webpackConfig.filter((config) => config.mode === 'production');
}

if (process.env.RUN_ENV === 'PRODUCTION') {
  webpackConfig.forEach((config) => {
    addLocales(config);
    externalDayjs(config);
    externalCssinjs(config);

    // Reduce non-minified dist files size
    config.optimization.usedExports = true;
    // use esbuild
    if (process.env.ESBUILD || process.env.CSB_REPO) {
      config.optimization.minimizer[0] = new EsbuildPlugin({
        target: targets,
        css: true,
      });
    }

    if (!process.env.CI || process.env.ANALYZER) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: '../report.html',
        }),
      );
    }

    if (!process.env.NO_DUP_CHECK) {
      config.plugins.push(
        new DuplicatePackageCheckerPlugin({
          verbose: true,
          emitError: true,
        }),
      );
    }

    config.plugins.push(
      new CircularDependencyPlugin({
        // add errors to webpack instead of warnings
        failOnError: true,
      }),
    );
  });
}

module.exports = [...webpackConfig];
