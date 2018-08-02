import * as React from 'react'

interface DropdownToggle {
  id?: string
  className?: string
  active?: boolean
  title?: string
  children?: React.ReactNode
}

export function DropdownToggle(props: DropdownToggle) {
  return (
    <a
      className={`${props.className || 'nav-link'} dropdown-toggle`}
      id={props.id}
      aria-haspopup="true"
      aria-expanded={props.active}
      title={props.title}
    >
      {props.children}
    </a>
  )
}