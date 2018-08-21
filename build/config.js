module.exports = {
  common: {
    links: {
      policy:
        'https://firebasestorage.googleapis.com/v0/b/zsebtanar-prod.appspot.com/o/docs%2Fzsebtanar-adatvedelmi-szabalyzat-2018.pdf?alt=media&amp;token=3cd16e18-51bc-4069-af98-051df97f2fe6'
    }
  },
  development: {
    api: 'https://zsebtanar-test.firebaseapp.com/api',
    firebase: {
      apiKey: 'AIzaSyD3SmCO7FvzawbprcqeC42YZBDmf6TZr4A',
      authDomain: 'zsebtanar-test.firebaseapp.com',
      databaseURL: 'https://zsebtanar-test.firebaseio.com',
      projectId: 'zsebtanar-test',
      storageBucket: 'zsebtanar-test.appspot.com',
      messagingSenderId: '650562716671'
    },
    algolia: {
      appId: 'J8PWVF536F',
      key: '502f297f7fecf9051688c205ab391225'
    },
    ga: {
      ua: 'UA-118780906-2'
    },
    recaptcha: {
      siteKey: '6LfQz2kUAAAAAIjVA4ZFmEQaURo6i2RSA27kZu7P'
    },
    sentry: {
      dsn: 'https://51329885b5704f2d8b19d4c29cad3e9a@sentry.io/275144'
    }
  },
  test: {
    api: '/api',
    firebase: {
      apiKey: 'AIzaSyD3SmCO7FvzawbprcqeC42YZBDmf6TZr4A',
      authDomain: 'zsebtanar-test.firebaseapp.com',
      databaseURL: 'https://zsebtanar-test.firebaseio.com',
      projectId: 'zsebtanar-test',
      storageBucket: 'zsebtanar-test.appspot.com',
      messagingSenderId: '650562716671'
    },
    sentry: {
      dsn: 'https://51329885b5704f2d8b19d4c29cad3e9a@sentry.io/275144'
    },
    // smartlook: {
    //   key: 'c8f36ab8bf000e26c4ccaed201df510e00fab8f4'
    // },
    // mouseflow: {
    //   src: '//cdn.mouseflow.com/projects/089c28d5-a646-4050-8c6d-d432b6f575d6.js'
    // },
    algolia: {
      appId: 'J8PWVF536F',
      key: '502f297f7fecf9051688c205ab391225'
    },
    ga: {
      ua: 'UA-118780906-2'
    },
    recaptcha: {
      siteKey: '6LfQz2kUAAAAAIjVA4ZFmEQaURo6i2RSA27kZu7P'
    }
  },
  production: {
    api: '/api',
    firebase: {
      apiKey: 'AIzaSyAqJ6qUZfiB586kHXHZdagx-i0vzHMrqMU',
      authDomain: 'zsebtanar-prod.firebaseapp.com',
      databaseURL: 'https://zsebtanar-prod.firebaseio.com',
      projectId: 'zsebtanar-prod',
      storageBucket: 'zsebtanar-prod.appspot.com',
      messagingSenderId: '294861517279'
    },
    sentry: {
      dsn: 'https://1cdfdee0c0f5468a8b1ae6d207271688@sentry.io/275143'
    },
    // smartlook: {
    //   key: 'c8f36ab8bf000e26c4ccaed201df510e00fab8f4'
    // },
    // mouseflow: {
    //   src: '//cdn.mouseflow.com/projects/089c28d5-a646-4050-8c6d-d432b6f575d6.js'
    // },
    algolia: {
      appId: 'UE3Y6VH327',
      key: '2a69c8b49d5f77f84eaa1b90c31add4d'
    },
    ga: {
      ua: 'UA-118780906-1'
    },
    recaptcha: {
      siteKey: '6Lf0J2oUAAAAAOmgqlipFG3TqlM4KSpcSngVgNut'
    }
  }
}
