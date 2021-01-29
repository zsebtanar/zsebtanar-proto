import React from 'react'
import cx from 'classnames'
import { ExternalLink as ExternalLinkIcon } from 'react-feather'

import './ExternalLink.scss'
import { Icon } from './icons/Icon'

interface Props extends Omit<React.HTMLProps<HTMLAnchorElement>, 'target' | 'rel'> {
  hideIcon?: boolean
}

export function ExternalLink({ className, hideIcon, ...props }: Props): JSX.Element {
  return (
    <a
      className={cx('external-link', className)}
      {...props}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children} {!hideIcon && <Icon icon={ExternalLinkIcon} />}
    </a>
  )
}
