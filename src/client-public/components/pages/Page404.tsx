import * as React from 'react'

import { Page } from 'client-common/components/Page'
import { ShowError } from 'client-common/components/generic/ShwoError'

export const Page404 = function Page404() {
  return (
    <Page className="page-404">
      <ShowError />
    </Page>
  )
}
