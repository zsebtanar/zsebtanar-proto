import * as React from 'react'
import { DialogClose } from './DialogClose'

interface DialogHeaderProps {
  onClose: () => void
  children?: React.ReactNode
}

export function DialogHeader(props: DialogHeaderProps) {
  return (
    <div className="modal-header">
      <h5 className="modal-title">{props.children}</h5>
      <DialogClose onClose={props.onClose} />
    </div>
  )
}
