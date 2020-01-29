import React, { ReactNode } from 'react'
import { DialogSize } from '../../types'

interface Props {
  className?: string
  size?: DialogSize
  children: ReactNode
}

const modalSize = (size?: DialogSize) => {
  switch (size) {
    case 'small':
      return 'modal-sm'
    case 'large':
      return 'modal-lg'
    default:
      return ''
  }
}

export function Dialog({ size, className, children }: Props) {
  return (
    <div className={`modal-dialog ${modalSize(size)} ${className || ''}`} role="document">
      <div className="modal-content">{children}</div>
    </div>
  )
}
