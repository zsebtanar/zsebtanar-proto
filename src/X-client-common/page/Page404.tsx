import * as React from 'react'
import { ShowError } from '../../client/generic/components/ShwoError'
import { setupPage } from '../component/hoc/setupPage'

export const Page404 = setupPage({ pageClassName: 'page-404' })(function Page404() {
  return <ShowError />
})
