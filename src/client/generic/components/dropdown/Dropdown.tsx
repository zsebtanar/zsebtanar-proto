import React, { createElement, ReactNode } from 'react'
import * as cx from 'classnames'
import { DropdownProvider, useDropdown } from './DropdownProvider'

interface Props {
  className?: string
  elementType?: string
  right?: boolean
  dropUp?: boolean
  children?: ReactNode
}

export function Dropdown(props: Props) {
  return (
    <DropdownProvider>
      <DropdownInner {...props} />
    </DropdownProvider>
  )
}

function DropdownInner({ className, elementType, dropUp, children }: Props) {
  const dropdown = useDropdown()

  return createElement(
    elementType || 'div',
    {
      className: cx('nav-item', className, {
        dropdown: !dropUp,
        dropup: dropUp,
        show: dropdown.isOpen
      }),
      onMouseEnter: dropdown.open,
      onMouseLeave: dropdown.close,
      onMouseUp: dropdown.close
    },
    children
  )
}
