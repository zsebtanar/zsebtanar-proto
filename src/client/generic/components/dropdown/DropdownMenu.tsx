import React from 'react'
import cx from 'classnames'
import { useDropdown } from 'client/generic/components/dropdown/DropdownProvider'

interface Props extends Pick<React.HTMLAttributes<unknown>, 'role'> {
  id?: string
  className?: string
  right?: boolean
  children: React.ReactNode
}

export function DropdownMenu({ id, className, right, children, ...props }: Props) {
  const dropdown = useDropdown()

  return (
    <div
      className={cx(className, 'dropdown-menu', {
        show: dropdown.isOpen,
        'dropdown-menu-right': right,
      })}
      aria-labelledby={id}
      {...props}
    >
      {children}
    </div>
  )
}
