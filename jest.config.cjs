module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!get-port/.*)'],  // you might need to ignore some packages
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.[jt]s$': '$1',
  },
  // moduleNameMapper: {
  //   '^@keybittech/wizapp/(.*)\\.js$': '<rootDir>/src/$1.ts',
  //   '^(\\.\\.?\\/.+)(?!cjs|polyfills|legacy-streams|clone|parse|functions|classes|node)(.*)\\.js$': '<rootDir>/src/$2.ts'
  // },
};