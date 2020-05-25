const path = require('path')

module.exports = {
  ...require('./jest.common'),
  displayName: 'shared',
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/shared/**/*.{spec,test}.{ts,tsx,js}'],
  coverageDirectory: path.join(__dirname, '../coverage/shared')
}
