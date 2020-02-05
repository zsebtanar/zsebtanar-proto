import React from 'react'
import { Icon } from 'client/generic/components/Icon'

interface Props extends React.AnchorHTMLAttributes<{}>{
  hideIcon?: boolean
}

export function ExternalLink({ hideIcon, ...props }: Props) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {props.children} {!hideIcon && <Icon fa="external-link"/>}
    </a>
  )
}
