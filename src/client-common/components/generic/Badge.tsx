import React from 'react'

interface BadgeProps {
  type: BadgeType
  children?: React.ReactNode
}

export function Badge({ type, children }: BadgeProps) {
  return <span className={`badge badge-${type} mx-1`}>{children}</span>
}
