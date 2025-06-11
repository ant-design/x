const compileModules = [
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
  setupFiles: [],
  setupFilesAfterEnv: [],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'md'],
  modulePathIgnorePatterns: [],
  moduleNameMapper: {
    '/\\.(css|less)$/': 'identity-obj-proxy',
    '^@ant-design/x-sdk$': '<rootDir>/components/index',
    '^@ant-design/x-sdk/es/(.*)$': '<rootDir>/components/$1',
    '^@ant-design/x-sdk/lib/(.*)$': '<rootDir>/components/$1',
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
    '!src/*/style/index.tsx',
    '!src/style/index.tsx',
    '!src/*/locale/index.tsx',
    '!src/*/__tests__/type.test.tsx',
    '!src/**/*/interface.{ts,tsx}',
    '!src/*/__tests__/image.test.{ts,tsx}',
    '!src/__tests__/node.test.tsx',
    '!src/*/demo/*.tsx',
  ],
  transformIgnorePatterns,
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.test.json',
    },
  },
  testEnvironmentOptions: {
    url: 'http://localhost/x-mardown',
  },
  bail: true,
  maxWorkers: '50%',
};
