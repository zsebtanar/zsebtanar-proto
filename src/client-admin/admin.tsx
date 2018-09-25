import * as React from 'react'
import { init } from '@sentry/browser';
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
    ignoreErrors: ['top.GLOBALS', 'originalCreateNotification', 'canvas.contentDocument', 'MyApp_RemoveAllHighlights', 'http.ts://tt.epicplay.com', 'Can\'t find variable: ZiteReader', 'jigsaw is not defined', 'ComboSearch is not defined', 'http.ts://loading.retry.widdit.com/', 'atomicFindClose', 'fb_xd_fragment', 'bmi_SafeAddOnload', 'EBCallBackMessageReceived', 'conduitPage'],
  })
}

startup().then(({ store, history }) => {
  render(
    <Provider store={store}>
      <Routes history={history} />
    </Provider>,
    document.getElementById('root')
  )
})
