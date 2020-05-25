import React, { ReactNode } from 'react'
import * as cx from 'classnames'

interface Props {
  className?: string
  children: ReactNode
}

export function ExerciseFormBlock({ className, children }: Props) {
  return (
    <div className={cx('card', className)}>
      <div className="card-body">{children}</div>
    </div>
  )
}
