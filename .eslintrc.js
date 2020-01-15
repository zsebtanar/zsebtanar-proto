const path = require('path')

module.exports = {
  parserOptions: {
    ecmaVersion: 2018
  },
  extends: ['eslint:recommended', 'plugin:jsx-a11y/recommended', 'prettier'],
  env: {
    node: true
  },
  overrides: [
    {
      files: '**/*.+(ts|tsx)',
      parser: '@typescript-eslint/parser',
      env: {
        browser: true
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        project: './build/ts/tsconfig.eslint.json'
      },
      plugins: ['@typescript-eslint/eslint-plugin', 'jsx-a11y'],
      extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'prettier/react'
      ],
      rules: {
        'jsx-a11y/anchor-is-valid': 1,
        'jsx-a11y/no-onchange': 0,
        'jsx-a11y/no-autofocus': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/no-use-before-define': 0
      }
    },
    {
      files: ['**/__test_/**'],
      settings: {
        'import/resolver': {
          jest: {
            jestConfigFile: path.join(__dirname, './jest.config.js')
          }
        }
      }
    }
  ]
}
