import { captureException } from '@sentry/browser';

export function logException(ex) {
  if (!__DEV__) {
    captureException(ex)
  } else {
    window.console && console.error && console.error(ex)
  }
}
