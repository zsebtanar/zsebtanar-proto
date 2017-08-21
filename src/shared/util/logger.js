export function logException (ex, context) {
  if (!__DEV__) {
    Raven.captureException(ex, {extra: context})
  }
  window.console && console.error && console.error(ex)
}
