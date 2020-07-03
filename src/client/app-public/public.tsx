import * as React from 'react'
import { render } from 'react-dom'
import { initSentryLogger } from 'client/generic/utils/logger'
import { UserProvider } from 'client/user/providers/UserProvider'
import { OverlayProvider } from 'client/overlay/providers/OverlayProvider'
import { PublicRouter } from 'client/app-public/providers/Routes'
import { PublicApp } from './PublicApp'

import './public.scss'

initSentryLogger()

const appRender = () =>
  render(
    <UserProvider>
      <PublicRouter>
        <OverlayProvider>
          <PublicApp />
        </OverlayProvider>
      </PublicRouter>
    </UserProvider>,
    document.getElementById('root'),
  )

if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('react-hot-ts').hot(module)(appRender())
} else {
  appRender()
}
