import React from 'react'

interface ButtonProps {
  title?: string
  btn?: 'primary' | 'secondary' | 'info' | 'warning'
  className?: string
  icon?: string
  disabled?: boolean
  loading?: boolean
  submit?: boolean
  tabIndex?: number
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
      className={`btn ${className || `btn-${btn || 'secondary'}`}`}
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
