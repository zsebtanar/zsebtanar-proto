import React, { ReactNode } from 'react'
import * as cx from 'classnames'
import { CloseButton } from './CloseButton'

interface Props {
  type?: AlertType
  className?: string
  onDismiss?: () => void
  children: ReactNode
}

export function Alert({ type, className, children, onDismiss }: Props): React.ReactNode {
  return (
    <div className={cx('alert', `alert-${type}`, className)}>
      {children}
      {onDismiss && <CloseButton onClick={onDismiss} />}
    </div>
  )
}
