import React from 'react'
import * as cx from 'classnames'

import './Button.scss'

interface ButtonProps {
  title?: string
  btn?: ButtonType
  className?: string
  icon?: string
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
      {icon && <i className={`fa fa-${icon} fa-fw mr-1`} />}
      {children}
      {loading && <i className="fa fa-cog fa-spin fa-fw" />}
    </button>
  )
}
