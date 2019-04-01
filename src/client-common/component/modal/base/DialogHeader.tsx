import * as React from 'react'
import { CloseButton } from '../../general/CloseButton'

interface DialogHeaderProps {
  onClose?: () => void
  children?: React.ReactNode
}

export function DialogHeader({onClose, children}: DialogHeaderProps) {
  return (
    <div className="modal-header">
      <h5 className="modal-title">{children}</h5>
      {onClose && <CloseButton onClick={onClose}/>}
    </div>
  )
}
