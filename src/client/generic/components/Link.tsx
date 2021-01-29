import React, { ReactNode } from 'react'
import cx from 'classnames'
import { Link as RRLink } from 'react-router-dom'
import * as H from 'history'
import { BadgeType } from '../../../shared/generic/types'

interface LinkProps {
  to: string | H.Path | ((location: H.Location) => H.Path)
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
