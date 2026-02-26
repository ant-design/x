module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['bin/**/*.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/'],
  coverageProvider: 'v8',
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
