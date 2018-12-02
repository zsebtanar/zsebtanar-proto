import * as React from 'react'

interface BadgeProps {
  type: BadgeType,
  children?: React.ReactNode
}

export function Badge(props: BadgeProps) {
  return (
    <span className={`badge badge-${props.type} mx-1`}>
      {props.children}
    </span>
  )
}
