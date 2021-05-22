import React, { ReactNode } from 'react'
import cx from 'classnames'

interface Props {
  children?: ReactNode
  className?: string
}

export function DialogFooter({ children, className }: Props): JSX.Element {
  return <div className={cx('modal-footer', className)}>{children}</div>
}
