import React from 'react'

const modalSize = size => {
  switch (size) {
    case 'small':
      return 'modal-sm'
    case 'large':
      return 'modal-lg'
    default:
      return ''
  }
}

export function Dialog(props) {
  return (
    <div
      className={`modal-dialog ${modalSize(props.size)} ${props.className || ''}`}
      role="document"
    >
      <div className="modal-content">{props.children}</div>
    </div>
  )
}
