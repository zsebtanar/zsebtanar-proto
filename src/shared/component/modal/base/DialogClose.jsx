import React from 'react'

export function DialogClose(props) {
  return (
    <button type="button" className="close" aria-label="Bezárás">
      <span aria-hidden={true} onClick={props.onClose}>
        &times;
      </span>
    </button>
  )
}
