import React from 'react'
import * as cx from 'classnames'
import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './Button.scss'

interface ButtonProps {
  title?: string
  btn?: ButtonType
  className?: string
  icon?: IconDefinition
  disabled?: boolean
  loading?: boolean
  submit?: boolean
  tabIndex?: number
  inline?: boolean
  onAction?: (event: MouseEvent) => void
  children?: React.ReactNode
}

export function Button({
  btn,
  onAction,
  tabIndex,
  icon,
  submit,
  className,
  title,
  disabled,
  loading,
  inline,
  children
}: ButtonProps) {
  const onClick =
    onAction &&
    (event => {
      event.preventDefault()
      onAction?.(event)
    })

  return (
    <button
      type={submit ? 'submit' : 'button'}
      className={cx(className, 'btn', `btn-${btn || 'secondary'}`, { 'btn-inline': inline })}
      onClick={onClick}
      tabIndex={tabIndex}
      title={title}
      aria-label={title}
      disabled={disabled || loading}
    >
      {icon && <FontAwesomeIcon icon={icon} fixedWidth className="mr-1" />}
      {children}
      {loading && <FontAwesomeIcon icon={faCog} fixedWidth spin />}
    </button>
  )
}
