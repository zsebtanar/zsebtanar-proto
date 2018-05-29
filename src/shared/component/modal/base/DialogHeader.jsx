import React from 'react'
import { DialogClose } from './DialogClose'

export function DialogHeader(props) {
  return (
    <div className="modal-header">
      <h5 className="modal-title">{props.children}</h5>
      <DialogClose onClose={props.onClose} />
    </div>
  )
}
