let sentryCaptureException

export function logException(ex: Error): void {
  if (__DEV__) {
    window.console && console.error && console.error(ex)
  } else if (sentryCaptureException) {
    sentryCaptureException(ex)
  }
}

export async function initSentryLogger(): Promise<void> {
  const [{ init: sentryInit }, { captureException }] = await Promise.all([
    import(/* webpackChunkName: 'sentry' */ '@sentry/browser/dist/sdk'),
    import(/* webpackChunkName: 'sentry' */ '@sentry/browser'),
  ])
  if (__CONFIG__.sentry.dsn) {
    sentryCaptureException = captureException
    sentryInit({
      dsn: __CONFIG__.sentry.dsn,
      environment: 'prototype',
      maxBreadcrumbs: 10,
      ignoreErrors: ['top.GLOBALS'],
    })
  }
}
