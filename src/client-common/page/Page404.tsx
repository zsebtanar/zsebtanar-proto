import * as React from 'react'
import { withTracker } from '../component/hoc/withTracker'
import { ShowError } from '../component/error/ShwoError'

export const Page404 = withTracker(function Page404() {
  return <ShowError />
})
