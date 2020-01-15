import { captureException } from '@sentry/browser'
import { init as sentryInit } from '@sentry/browser/dist/sdk'

export function logException(ex) {
  if (!__DEV__) {
    captureException(ex)
  } else {
    window.console && console.error && console.error(ex)
  }
}

export function initSentryLogger() {
  if (__CONFIG__.sentry.dsn) {
    sentryInit({
      dsn: __CONFIG__.sentry.dsn,
      environment: 'prototype',
      maxBreadcrumbs: 10,
      ignoreErrors: ['top.GLOBALS']
    })
  }
}
