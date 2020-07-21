import 'client/tools/why-did-you-render.ts'
import { initApp } from '../tools/react-hot-loader'

import * as React from 'react'
import { render } from 'react-dom'
import { initSentryLogger } from 'client/generic/utils/logger'
import { UserProvider } from 'client/user/providers/UserProvider'
import { AdminRouter } from 'client/app-admin/provider/Router'
import { AdminApp } from 'client/app-admin/AdminApp'
import { AssetManagerProvider } from '../asset/providers/ManageAssetProvider'
import { OverlayProvider } from 'client/overlay/providers/OverlayProvider'

import './admin.scss'

initSentryLogger()

initApp(() =>
  render(
    <UserProvider>
      <AdminRouter>
        <AssetManagerProvider>
          <OverlayProvider>
            <AdminApp />
          </OverlayProvider>
        </AssetManagerProvider>
      </AdminRouter>
    </UserProvider>,
    document.getElementById('root'),
  ),
)
