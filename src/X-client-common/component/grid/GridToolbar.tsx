import * as React from 'react'

interface Props {
  children?: React.ReactNode
}

export function GridToolBar(props: Props) {
  return (
    <div className="btn-toolbar justify-content-between align-items-center">{props.children}</div>
  )
}
