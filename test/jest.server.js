const path = require('path')

module.exports = {
  ...require('./jest.common'),
  displayName: 'server',
  testEnvironment: 'jest-environment-node',
  testMatch: ['server/**/__tests__/**/*.+(ts|tsx|js)', 'server/**/?(*.)+(spec|test).+(ts|tsx|js)'],
  coverageDirectory: path.join(__dirname, '../coverage/server')
}
