import * as React from 'react'

interface DialogBodyProps {
  children?: React.ReactNode
}

export function DialogBody(props: DialogBodyProps) {
  return <div className="modal-body">{props.children}</div>
}
