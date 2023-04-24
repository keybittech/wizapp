module.exports = {
  preset: 'ts-jest',
  coverageIgnorePattern: ['results.json'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true
      }
    }
  }
};