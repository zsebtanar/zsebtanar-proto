import * as React from 'react'

import { PublicPage } from 'client/generic/components/PublicPage'
import { ShowError } from 'client/generic/components/ShowError'

export function Page404(): JSX.Element {
  return (
    <PublicPage className="page-404">
      <ShowError />
    </PublicPage>
  )
}
