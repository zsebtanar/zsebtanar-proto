import * as React from 'react'

interface DropdownMenuProps {
  id?: string
  className?: string
  active?: boolean
  children: React.ReactNode
}

export function DropdownMenu(props: DropdownMenuProps) {
  return (
    <div
      className={`dropdown-menu ${props.className || ''} ${props.active ? 'show' : ''}`}
      aria-labelledby={props.id}
      key="DropdownMenuKey"
    >
      {props.children}
    </div>
  )
}