import React from 'react'

interface LinkProps extends Omit<React.HTMLProps<HTMLAnchorElement>, 'href'> {
  to?: string
}

export function Link({
  tabIndex,
  role,
  className,
  title,
  to,
  children,
  ...props
}: LinkProps): JSX.Element {
  return (
    <a
      href={to || '#'}
      className={className}
      tabIndex={tabIndex}
      title={title}
      role={role}
      {...props}
    >
      {children}
    </a>
  )
}
