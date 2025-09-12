const compileModules = [
  'react-sticky-box',
  'rc-tween-one',
  '@babel',
  '@ant-design',
  'countup.js',
  '.pnpm',
  'react-syntax-highlighter',
  'mermaid',
  'khroma',
  'd3',
  'd3-',
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
  setupFiles: ['./tests/setup.ts', 'jest-canvas-mock'],
  setupFilesAfterEnv: ['./tests/setupAfterEnv.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'md'],
  modulePathIgnorePatterns: [],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '^@ant-design/x-markdown$': '<rootDir>/components/index',
    '^@ant-design/x-markdown/es/(.*)$': '<rootDir>/components/$1',
    '^@ant-design/x-markdown/lib/(.*)$': '<rootDir>/components/$1',
    '^@ant-design/x/es/locale/useLocale$': '<rootDir>/../x/components/locale/useLocale',
    '^@ant-design/x/locale/en_US$': '<rootDir>/../x/components/locale/en_US',
  },
  testPathIgnorePatterns: ['/node_modules/', 'dekko', 'node', 'image.test.js', 'image.test.ts'],
  transform: {
    '\\.tsx?$': resolve('codePreprocessor'),
    '\\.(m?)js$': resolve('codePreprocessor'),
    '\\.md$': resolve('demoPreprocessor'),
    '\\.(jpg|png|gif|svg)$': resolve('imagePreprocessor'),
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
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
      useESM: true,
    },
  },
  testEnvironmentOptions: {
    url: 'http://localhost/x-mardown',
  },
  bail: true,
  maxWorkers: '50%',
};
