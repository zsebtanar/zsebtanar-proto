import * as React from 'react'
import { hot } from 'react-hot-ts'
import { init } from '@sentry/browser'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Routes } from './Routes'
import { startup } from './startup'

import 'react-select/scss/default.scss'
import 'client-common/style/libs/github-markdown.css'
import 'client-common/style/admin.scss'

if (__CONFIG__.sentry.dsn) {
  init({
    dsn: __CONFIG__.sentry.dsn,
    environment: 'prototype',
    maxBreadcrumbs: 10,
    ignoreErrors: ['top.GLOBALS']
  })
}

startup().then(({ store, history }) => {
  hot(module)(
    render(
      <Provider store={store}>
        <Routes history={history} />
      </Provider>,
      document.getElementById('root')
    )
  )
})
