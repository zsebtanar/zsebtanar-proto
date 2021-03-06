const commonConfig = {
  links: {
    policy:
      'https://firebasestorage.googleapis.com/v0/b/zsebtanar-prod.appspot.com/o/docs%2Fzsebtanar-adatvedelmi-szabalyzat-v3.pdf?alt=media&token=ba896814-669b-4a93-83e7-ed7e0f45a31b',
  },
  csp: [
    ['base-uri', "'self'"],
    ['default-src', "'none'"],
    ['manifest-src', 'https://zsebtanar.hu'],
    [
      'script-src',
      "'self'",
      'https://*.firebaseio.com',
      'https://www.google-analytics.com',
      'https://apis.google.com',
    ],
    [
      'connect-src',
      "'self'",
      'wss://*.firebaseio.com',
      'https://*.algolianet.com',
      'https://*.algolia.net',
      'https://www.googleapis.com',
      'https://securetoken.googleapis.com',
    ],
    ['font-src', 'https://cdnjs.cloudflare.com'],
    ['style-src', "'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
    [
      'img-src',
      "'self'",
      'https://firebasestorage.googleapis.com',
      'https://www.google-analytics.com',
      'https://www.paypalobjects.com',
      'https://www.algolia.com',
      'data:', // bootstrap alternative checkbox es radio
    ],
    ['form-action', "'self'"],
    ['frame-src', 'https://*.firebaseio.com', 'https://zsebtanar.hu'],
    ['frame-ancestors', "'none'"],
  ],
}

const baseTestConfig = {
  siteUrl: 'https://zsebtanar-test.web.app',
  api: '/api',
  firebase: {
    apiKey: 'AIzaSyD3SmCO7FvzawbprcqeC42YZBDmf6TZr4A',
    authDomain: 'zsebtanar-test.firebaseapp.com',
    databaseURL: 'https://zsebtanar-test.firebaseio.com',
    projectId: 'zsebtanar-test',
    storageBucket: 'zsebtanar-test.appspot.com',
    messagingSenderId: '650562716671',
    appId: '1:650562716671:web:439500a14468a2bf3eddca',
    measurementId: 'G-Z8RJZZFER8',
  },
  algolia: {
    appId: 'J8PWVF536F',
    key: '502f297f7fecf9051688c205ab391225',
  },
  ga: {
    ua: 'UA-118780906-2',
  },
  recaptcha: {
    siteKey: '6LfQz2kUAAAAAIjVA4ZFmEQaURo6i2RSA27kZu7P',
  },
}

const envConfig = {
  emulator: {
    ...baseTestConfig,
    siteUrl: 'http://localhost:3000',
    api: 'http://localhost:5001/zsebtanar-test/us-central1/api/api',
    sentry: {},
  },
  development: {
    ...baseTestConfig,
    siteUrl: 'http://localhost:3000',
    api: 'https://zsebtanar-test.firebaseapp.com/api',
    sentry: {},
  },
  test: {
    ...baseTestConfig,
    api: '/api',
    sentry: {
      dsn: 'https://51329885b5704f2d8b19d4c29cad3e9a@sentry.io/275144',
      csp: 'https://sentry.io/api/275144/security/?sentry_key=51329885b5704f2d8b19d4c29cad3e9a',
    },
  },
  production: {
    siteUrl: 'https://zsebtanar.hu',
    api: '/api',
    firebase: {
      apiKey: 'AIzaSyAqJ6qUZfiB586kHXHZdagx-i0vzHMrqMU',
      authDomain: 'zsebtanar.hu',
      databaseURL: 'https://zsebtanar-prod.firebaseio.com',
      projectId: 'zsebtanar-prod',
      storageBucket: 'zsebtanar-prod.appspot.com',
      messagingSenderId: '294861517279',
      appId: '1:294861517279:web:9fe7129fd7336d19f1946a',
      measurementId: 'G-87809P2WWK',
    },
    sentry: {
      dsn: 'https://1cdfdee0c0f5468a8b1ae6d207271688@sentry.io/275143',
      csp: 'https://sentry.io/api/275143/security/?sentry_key=1cdfdee0c0f5468a8b1ae6d207271688',
    },
    algolia: {
      appId: 'UE3Y6VH327',
      key: '2a69c8b49d5f77f84eaa1b90c31add4d',
    },
    ga: {
      ua: 'UA-118780906-1',
    },
    recaptcha: {
      siteKey: '6Lf0J2oUAAAAAOmgqlipFG3TqlM4KSpcSngVgNut',
    },
  },
}

function getConfig() {
  const server = process.env.SERVER_ENV || 'development'
  return { ...commonConfig, ...envConfig[server] }
}

function getCSPConfig(withReport) {
  const server = process.env.SERVER_ENV || 'development'
  const cfg = envConfig[server]
  return commonConfig.csp
    .map((x) => x.join(' '))
    .concat(withReport && cfg.sentry ? `report-uri ${cfg.sentry.csp}` : [])
    .join('; ')
}

function getRobotTxt() {
  const server = process.env.SERVER_ENV || 'development'
  const config = getConfig()
  switch (server) {
    case 'production':
      return ['User-agent: * Disallow: /admin/*', `Sitemap: ${config.siteUrl}sitemap.xml`].join(
        '\n',
      )
    default:
      return ['User-agent: * Disallow: /'].join('\n')
  }
}

module.exports = {
  getConfig,
  getCSPConfig,
  getRobotTxt,
}
