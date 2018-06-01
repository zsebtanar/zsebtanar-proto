import * as React from 'react'

interface IconProps {
  fa: string
  size?: 'lg' | '2x' | '4x'
  className?: string
  children?: React.ReactNode
}

export function Icon(props: IconProps) {
  const size = props.size ? 'fa-' + props.size : ''
  const className = props.className || ''
  return (
    <i className={`fa fa-${props.fa} ${size} ${className}`} aria-hidden="true">
      {props.children}
    </i>
  )
}
