import React from 'react'
import * as cx from 'classnames'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './ExternalLink.scss'

interface Props extends React.AnchorHTMLAttributes<{}> {
  hideIcon?: boolean
}

export function ExternalLink({ className, hideIcon, ...props }: Props) {
  return (
    <a
      className={cx('external-link', className)}
      {...props}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children} {!hideIcon && <FontAwesomeIcon icon={faExternalLinkAlt} />}
    </a>
  )
}
