module.exports = {
  ...require('./test/jest.common'),
  collectCoverageFrom: ['**/src/**/*.+(ts|tsx|js)'],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
  projects: ['./test/jest.client.js', './test/jest.server.js', './test/jest.shared.js'],
}
