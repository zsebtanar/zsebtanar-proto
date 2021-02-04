declare const __DEV__: boolean
declare const __PRODUCTION__: boolean
declare const __CONFIG__: {
  api: string
  firebase: Record<string, string>
  sentry: {
    dsn: string
  }
  algolia: {
    appId: string
    key: string
  }
  ga: {
    ua: 'string'
  }
  recaptcha: {
    siteKey: string
  }
  links: {
    policy: string
  }
}
declare const __SERVER_ENV__: string
