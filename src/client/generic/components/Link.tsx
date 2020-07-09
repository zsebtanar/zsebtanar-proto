import React from 'react'
import cx from 'classnames'

interface LinkProps extends Omit<React.HTMLProps<HTMLAnchorElement>, 'href'> {
  to?: string
  badge?: BadgeType
}

export function Link({ className, to, badge, children, ...props }: LinkProps): JSX.Element {
  return (
    <a href={to || '#'} className={cx(className, { [`badge badge-${badge}`]: badge })} {...props}>
      {children}
    </a>
  )
}
