import * as React from 'react'

import { Page } from 'client/generic/components/Page'
import { ShowError } from 'client/generic/components/ShwoError'

export function Page404() {
  return (
    <Page className="page-404">
      <ShowError />
    </Page>
  )
}
