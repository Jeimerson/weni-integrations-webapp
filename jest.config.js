const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname),
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  coverageReporters: ['text', 'text-summary'],
  verbose: true,
  setupFiles: ['<rootDir>/tests/unit/setup'],
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router.js',
    '!**/node_modules/**',
    '!tests/**',
    '!src/utils/time.js',
    // ignore store configuration files
    '!src/store/index.js',
    '!src/store/types.js',
    '!src/store/auth/index.js',
    '!src/store/auth/state.js',
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: -1,
    },
  },
  moduleFileExtensions: ['js', 'json', 'vue'],
  snapshotSerializers: ['jest-serializer-vue'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
  },
  moduleNameMapper: { '\\.(css|less)$': '<rootDir>/tests/__mocks__/styleMock.js' },
};
