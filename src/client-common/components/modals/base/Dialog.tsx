import React, { ReactNode } from 'react'

type ModelSize = 'small' | 'large'

interface Props {
  className?: string
  size?: ModelSize
  children: ReactNode
}

const modalSize = (size?: ModelSize) => {
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
