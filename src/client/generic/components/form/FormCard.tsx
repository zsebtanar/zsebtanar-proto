import React, { ReactNode } from 'react'
import cx from 'classnames'

interface Props {
  className?: string
  children: ReactNode
}

export function FormCard({ className, children }: Props): JSX.Element {
  return (
    <div className={cx('card', className)}>
      <div className="card-body">{children}</div>
    </div>
  )
}
