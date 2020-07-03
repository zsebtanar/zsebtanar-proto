import React from 'react'
import { useDropdown } from './DropdownProvider'

interface Props extends Omit<React.HTMLProps<HTMLButtonElement>, 'type'> {
  id?: string
  className?: string
  title?: string
  children?: React.ReactNode
}

export function DropdownToggle({ id, className, children, ...props }: Props): JSX.Element {
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
      className={`${className} dropdown-toggle`}
      aria-haspopup="true"
      aria-expanded={dropdown.isOpen}
      onClick={action}
      {...props}
    >
      {children}
    </button>
  )
}
