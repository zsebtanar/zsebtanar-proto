import 'client/tools/why-did-you-render.ts'
import { initApp } from '../tools/react-hot-loader'

import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { initSentryLogger } from 'client/generic/utils/logger'
import { UserProvider } from 'client/user/providers/UserProvider'
import { OverlayProvider } from 'client/overlay/providers/OverlayProvider'
import { ClassificationProvider } from 'client/classification/provider/ClassificationProvider'
import { PublicApp } from './PublicApp'

import './public.scss'

initSentryLogger()

initApp(() =>
  render(
    <ClassificationProvider>
      <UserProvider>
        <OverlayProvider>
          <BrowserRouter>
            <PublicApp />
          </BrowserRouter>
        </OverlayProvider>
      </UserProvider>
    </ClassificationProvider>,
    document.getElementById('root'),
  ),
)
