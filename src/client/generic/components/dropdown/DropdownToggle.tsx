import React from 'react'
import { useDropdown } from './DropdownProvider'

interface Props extends Pick<React.HTMLAttributes<unknown>, 'role'> {
  id?: string
  className?: string
  title?: string
  btn?: ButtonType
  children?: React.ReactNode
}

export function DropdownToggle({ id, className, btn, children, ...props }: Props) {
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
      type="button"
      className={`btn ${btn || 'link'} ${className || 'nav-link'} dropdown-toggle`}
      aria-haspopup="true"
      aria-expanded={dropdown.isOpen}
      onClick={action}
      {...props}
    >
      {children}
    </button>
  )
}
