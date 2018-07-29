import * as React from 'react'

interface DialogFooterProps {
  children?: React.ReactNode
}

export function DialogFooter(props: DialogFooterProps) {
  return <div className="modal-footer text-center">{props.children}</div>
}
