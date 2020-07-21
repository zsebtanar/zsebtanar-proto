import React, { ReactNode } from 'react'
import cx from 'classnames'
import { Link as RRLink } from 'react-router-dom'
import { LocationDescriptorObject } from 'history'

interface LinkProps {
  to: string | LocationDescriptorObject
  className?: string
  children: ReactNode
  badge?: BadgeType
}

export function Link({ className, to, badge, children, ...props }: LinkProps): JSX.Element {
  return (
    <RRLink to={to} className={cx(className, { [`badge badge-${badge}`]: badge })} {...props}>
      {children}
    </RRLink>
  )
}
