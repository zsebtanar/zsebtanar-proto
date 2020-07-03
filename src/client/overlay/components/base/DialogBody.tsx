import React, { ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

export function DialogBody({ children }: Props): JSX.Element {
  return <div className="modal-body">{children}</div>
}
