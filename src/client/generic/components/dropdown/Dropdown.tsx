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

export function Dropdown({ className, elementType, dropUp, children }: Props) {
  const dropdown = useDropdown()
  return (
    <DropdownProvider>
      {createElement(
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
      )}
    </DropdownProvider>
  )
}
