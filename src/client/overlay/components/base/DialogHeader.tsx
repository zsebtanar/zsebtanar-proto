import React, { ReactNode } from 'react'
import { CloseButton } from 'client/generic/components/CloseButton'

interface Props {
  onClose?: () => void
  children?: ReactNode
}

export function DialogHeader({ onClose, children }: Props): JSX.Element {
  return (
    <div className="modal-header">
      <h5 className="modal-title">{children}</h5>
      {onClose && <CloseButton onClick={onClose} />}
    </div>
  )
}
