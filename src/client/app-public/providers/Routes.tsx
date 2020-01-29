import React, { ReactNode } from 'react'
import { Router } from 'react-router-dom'
import { initHistory } from 'client/generic/utils/history'

interface Props {
  children: ReactNode
}

const history = initHistory('/')

export function PublicRouter({ children }: Props) {
  return <Router history={history}>{children}</Router>
}
