import * as React from 'react'
import { render } from 'react-dom'
import { initSentryLogger } from 'client/generic/utils/logger'
import { UserProvider } from 'client/user/providers/UserProvider'
import { AdminRouter } from 'client/app-admin/provider/Router'
import { AdminApp } from 'client/app-admin/AdminApp'
import { AssetManagerProvider } from '../assets/providers/ManageAssetProvider'
import { OverlayProvider } from 'client/overlay/providers/OverlayProvider'

import './admin.scss'

initSentryLogger()

const appRender = () =>
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
  )
if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('react-hot-ts').hot(module)(appRender())
} else {
  appRender()
}
