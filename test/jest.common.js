const path = require('path')

module.exports = {
  rootDir: path.join(__dirname, '..'),
  roots: ['<rootDir>/src'],
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules', path.join(__dirname, '../src'), __dirname],
  moduleNameMapper: {
    '\\.s?css$': require.resolve('./style-mock.js')
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
}
