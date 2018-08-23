import * as React from 'react'
import { withTracker } from '../component/hoc/withTracker'
import { Icon } from '../component/general/Icon'

export const Page404 = withTracker(function Page404() {
  return (
    <div className="d-flex h-100">
      <div className="m-auto">
        <Icon size="4x" fa="wpexplorer"/>
        <h1>A keresett oldal nem létezik.</h1>

        <a href="/">Főoldal</a>
        <a href="/search">Keresés</a>
      </div>
    </div>
  )
})
