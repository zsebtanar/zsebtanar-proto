import * as React from 'react'
import { render } from 'react-dom'
import { initSentryLogger } from 'client/generic/utils/logger'
import { UserProvider } from 'client/user/providers/UserProvider'
import { OverlayProvider } from 'client/overlay/providers'
import { PublicRouter } from 'client/generic/providers/Routes'
import { PublicApp } from './PublicApp'

import './public.scss'
import { hot } from 'react-hot-ts'

initSentryLogger()

hot(module)(
  render(
    <UserProvider>
      <PublicRouter>
        <OverlayProvider>
          <PublicApp />
        </OverlayProvider>
      </PublicRouter>
    </UserProvider>,
    document.getElementById('root')
  )
)
