const compileModules = [
  '@rc-component',
  'react-sticky-box',
  'rc-tween-one',
  '@babel',
  '@ant-design',
  'countup.js',
  '.pnpm',
];

const resolve = (p) => require.resolve(`@ant-design/tools/lib/jest/${p}`);

const ignoreList = [];

// cnpm use `_` as prefix
['', '_'].forEach((prefix) => {
  compileModules.forEach((module) => {
    ignoreList.push(`${prefix}${module}`);
  });
});

const transformIgnorePatterns = [
  // Ignore modules without es dir.
  // Update: @babel/runtime should also be transformed
  `[/\\\\]node_modules[/\\\\](?!${ignoreList.join('|')})[^/\\\\]+?[/\\\\](?!(es)[/\\\\])`,
];

function getTestRegex(libDir) {
  if (['dist', 'lib', 'es', 'dist-min'].includes(libDir)) {
    return 'demo\\.test\\.(j|t)sx?$';
  }
  return '.*\\.test\\.(j|t)sx?$';
}

module.exports = {
  verbose: true,
  testEnvironment: '@happy-dom/jest-environment',
  setupFiles: ['./tests/setup.ts'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'md'],
  modulePathIgnorePatterns: [],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', 'dekko', 'node', 'image.test.js', 'image.test.ts'],
  transform: {
    '\\.tsx?$': resolve('codePreprocessor'),
    '\\.(m?)js$': resolve('codePreprocessor'),
    '\\.md$': resolve('demoPreprocessor'),
    '\\.(jpg|png|gif|svg)$': resolve('imagePreprocessor'),
  },
  testRegex: getTestRegex(process.env.LIB_DIR),
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/demo/**',
    '!src/**/__tests__/**',
    '!src/version.ts',
    '!src/index.ts',  // 纯重导出文件
    '!src/A2UI/types/**',  // 纯类型文件
  ],
  transformIgnorePatterns,
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
  testEnvironmentOptions: {
    url: 'http://localhost/x-card',
  },
  bail: true,
  maxWorkers: '50%',
};
