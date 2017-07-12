module.exports = {
  "env": {
    "node": true,
    "jest/globals": true
  },
  'extends': 'standard',
  "parser": "babel-eslint",
  'plugins': [
    'jest'
  ],
  "rules": {
    "strict": 0,
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/valid-expect": "error"
  },
  "globals": {}
}