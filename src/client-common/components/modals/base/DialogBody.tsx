import React, { ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

export function DialogBody({ children }: Props) {
  return <div className="modal-body">{children}</div>
}
