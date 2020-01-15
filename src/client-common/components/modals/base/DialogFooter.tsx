import React, { ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

export function DialogFooter({ children }: Props) {
  return <div className="modal-footer text-center">{children}</div>
}
