const path = require('path')

module.exports = {
  ...require('./jest.common'),
  displayName: 'server',
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/client/**/*.{spec,test}.{ts,tsx,js}'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  coverageDirectory: path.join(__dirname, '../coverage/client')
}
