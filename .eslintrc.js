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
      plugins: ['@typescript-eslint/eslint-plugin', 'jsx-a11y', 'react-hooks'],
      extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'prettier/react'
      ],
      rules: {
        'jsx-a11y/anchor-is-valid': 'warn',
        'jsx-a11y/no-noninteractive-element-interactions': 'warn',
        'jsx-a11y/no-onchange': 'off',
        'jsx-a11y/no-autofocus': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
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
