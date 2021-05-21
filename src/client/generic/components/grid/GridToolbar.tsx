import React from 'react'

interface Props {
  children?: React.ReactNode
}

export function GridToolBar({ children }: Props): JSX.Element {
  return <div className="btn-toolbar justify-content-between align-items-center">{children}</div>
}
