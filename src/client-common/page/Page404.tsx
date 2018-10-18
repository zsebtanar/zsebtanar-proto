import * as React from 'react'
import { ShowError } from '../component/error/ShwoError'
import { setupPage } from '../component/hoc/setupPage'

export const Page404 = setupPage()(function Page404() {
  return <ShowError />
})
