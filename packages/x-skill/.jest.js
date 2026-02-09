module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['bin/**/*.js', '!bin/**/*.test.*', '!bin/**/*.spec.*'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['**/__tests__/**/*.test.js', '**/__tests__/**/*.spec.js'],
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/'],
  coverageProvider: 'v8',
  testTimeout: 10000,
};
