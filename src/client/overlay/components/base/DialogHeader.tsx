import React, { ReactNode } from 'react'
import { CloseButton } from '../../../generic/components'

interface Props {
  onClose?: () => void
  children?: ReactNode
}

export function DialogHeader({ onClose, children }: Props) {
  return (
    <div className="modal-header">
      <h5 className="modal-title">{children}</h5>
      {onClose && <CloseButton onClick={onClose} />}
    </div>
  )
}
