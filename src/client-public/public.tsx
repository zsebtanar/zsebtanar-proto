import * as React from 'react'
import { init } from '@sentry/browser'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Recaptcha } from 'client-common/component/util/Recaptcha'
import { Routes } from './Routes'
import { startup } from './startup'

import 'client-common/style/public.scss'

if (__CONFIG__.sentry.dsn) {
  init({
    dsn: __CONFIG__.sentry.dsn,
    environment: 'prototype',
    maxBreadcrumbs: 10,
    ignoreErrors: ['top.GLOBALS']
  })
}

startup().then(({ store, history }) => {
  render(
    <Provider store={store}>
      <Recaptcha>
        <Routes history={history} />
      </Recaptcha>
    </Provider>,
    document.getElementById('root')
  )
})
