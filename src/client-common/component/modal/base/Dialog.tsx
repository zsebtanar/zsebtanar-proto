import * as React from 'react'

type ModelSize = 'small' | 'large'

interface DialogProps {
  className?: string
  size?: ModelSize,
  children: React.ReactNode
}

const modalSize = (size: ModelSize) => {
  switch (size) {
    case 'small':
      return 'modal-sm'
    case 'large':
      return 'modal-lg'
    default:
      return ''
  }
}

export function Dialog(props: DialogProps) {
  return (
    <div
      className={`modal-dialog ${modalSize(props.size)} ${props.className || ''}`}
      role="document"
    >
      <div className="modal-content">{props.children}</div>
    </div>
  )
}
