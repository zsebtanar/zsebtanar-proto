import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function Muted({ children }: Props) {
  return <i className="text-muted">{children}</i>
}
