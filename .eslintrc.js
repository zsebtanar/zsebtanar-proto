module.exports = {
  "env": {
    "browser": true
  },
  'extends': 'standard',
  "parser": "babel-eslint",
  'plugins': [
    'react'
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    }
  },
  "rules": {
    "strict": 0,
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "space-before-function-paren": "off"
  },
  "globals": {
    "firebase": true,
    "alert": true,
    "confirm": true,
    "__DEV__": true,
    "__FN_PATH__": true,
    "Raven": true
  }
}