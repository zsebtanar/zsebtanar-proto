import React from 'react'

interface IconProps {
  fa: string
  size?: 'lg' | '2x' | '4x'
  className?: string
  children?: React.ReactNode
}

export function Icon({ fa, children, size, className }: IconProps) {
  const iconSize = size ? 'fa-' + size : ''

  return (
    <i className={`fa fa-${fa} ${iconSize} ${className || ''}`} aria-hidden="true">
      {children}
    </i>
  )
}
