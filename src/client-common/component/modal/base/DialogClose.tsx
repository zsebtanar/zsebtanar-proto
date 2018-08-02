import * as React from 'react'

interface DialogCloseProps {
  onClose: () => void
}

export function DialogClose(props: DialogCloseProps) {
  return (
    <button type="button" className="close" aria-label="Bezárás">
      <span aria-hidden={true} onClick={props.onClose}>
        &times;
      </span>
    </button>
  )
}
