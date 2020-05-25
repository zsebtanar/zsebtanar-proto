module.exports = {
  ...require('./test/jest.common'),
  collectCoverageFrom: ['**/src/**/*.+(ts|tsx|js)'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  },
  projects: ['./test/jest.client.js', './test/jest.server.js', './test/jest.shared.js']
}
