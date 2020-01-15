import React from 'react'

interface LinkProps extends React.AnchorHTMLAttributes<{}> {
  to?: string
}

export function Link({ tabIndex, role, className, title, to, children }: LinkProps) {
  return (
    <a href={to || '#'} className={className} tabIndex={tabIndex} title={title} role={role}>
      {children}
    </a>
  )
}
