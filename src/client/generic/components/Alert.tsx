import React, { ReactNode } from 'react'
import cx from 'classnames'
import { CloseButton } from './CloseButton'

interface Props {
  type?: AlertType
  className?: string
  onDismiss?: () => void
  children: ReactNode | string
}

export function Alert({ type, className, children, onDismiss }: Props): JSX.Element {
  return (
    <div className={cx('alert', `alert-${type}`, className)}>
      {children}
      {onDismiss && <CloseButton onClick={onDismiss} />}
    </div>
  )
}
