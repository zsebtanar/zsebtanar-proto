import React from 'react'
import * as cx from 'classnames'

interface Props extends Pick<React.HTMLAttributes<unknown>, 'role'> {
  id?: string
  className?: string
  active?: boolean
  right?: boolean
  children: React.ReactNode
}

export function DropdownMenu({ id, className, active, right, children, ...props }: Props) {
  return (
    <div
      className={cx(className, 'dropdown-menu', { show: active, 'dropdown-menu-right': right })}
      aria-labelledby={id}
      {...props}
    >
      {children}
    </div>
  )
}
