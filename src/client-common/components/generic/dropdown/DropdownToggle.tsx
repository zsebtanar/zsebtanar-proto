import { useDropdown } from './DropdownProvider'
import React from 'react'

interface Props extends Pick<React.HTMLAttributes<unknown>, 'role'> {
  id?: string
  className?: string
  title?: string
  children?: React.ReactNode
}

export function DropdownToggle({ id, className, children, ...props }: Props) {
  const dropdown = useDropdown()

  const action = () => {
    if (dropdown.isOpen) {
      dropdown.open()
    } else {
      dropdown.close()
    }
  }

  return (
    <button
      id={id}
      className={`${className || 'nav-link'} dropdown-toggle`}
      aria-haspopup="true"
      aria-expanded={dropdown.isOpen}
      onClick={action}
      {...props}
    >
      {children}
    </button>
  )
}
