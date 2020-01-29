import * as React from 'react'
import { render } from 'react-dom'
import { initSentryLogger } from 'client/generic/utils/logger'
import { UserProvider } from 'client/user/providers/UserProvider'
import { OverlayProvider } from 'client/overlay/providers'
import { Recaptcha } from './providers/Recaptcha'
import { PublicRouter } from './providers/Routes'
import { PublicApp } from './PublicApp'

import './public.scss'

initSentryLogger()

render(
  <Recaptcha>
    <UserProvider>
      <PublicRouter>
        <OverlayProvider>
          <PublicApp />
        </OverlayProvider>
      </PublicRouter>
    </UserProvider>
  </Recaptcha>,
  document.getElementById('root')
)
