import * as React from 'react'
import { render } from 'react-dom'
import { initSentryLogger } from 'client-common/utils/logger'
import { UserProvider, OverlayProvider, Recaptcha } from 'client-common/providers'
import { PublicRouter } from './providers/Routes'
import { PublicApp } from './components'

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
