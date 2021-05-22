export function initApp(appRender: () => void): void {
  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('react-hot-ts').hot(module)(appRender())
  } else {
    appRender()
  }
}
