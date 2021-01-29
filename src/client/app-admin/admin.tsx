import 'client/tools/why-did-you-render.ts'
import { initApp } from '../tools/react-hot-loader'

import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { initSentryLogger } from 'client/generic/utils/logger'
import { UserProvider } from 'client/user/providers/UserProvider'
import { AdminApp } from 'client/app-admin/AdminApp'
import { AssetManagerProvider } from '../asset/providers/ManageAssetProvider'
import { OverlayProvider } from 'client/overlay/providers/OverlayProvider'

import './admin.scss'

initSentryLogger()

initApp(() =>
  render(
    <UserProvider>
      <AssetManagerProvider>
        <OverlayProvider>
          <BrowserRouter basename="/admin/">
            <AdminApp />
          </BrowserRouter>
        </OverlayProvider>
      </AssetManagerProvider>
    </UserProvider>,
    document.getElementById('root'),
  ),
)
