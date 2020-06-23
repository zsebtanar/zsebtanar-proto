import * as React from 'react'

import { PublicPage } from 'client/generic/components/PublicPage'
import { ShowError } from 'client/generic/components/ShwoError'

export function Page404() {
  return (
    <PublicPage className="page-404">
      <ShowError />
    </PublicPage>
  )
}
