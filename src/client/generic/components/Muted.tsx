import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function Muted({ children }: Props): JSX.Element {
  return <i className="text-muted">{children}</i>
}
