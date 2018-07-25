import * as React from 'react'
import { pickBy, startsWith } from 'ramda'

interface LinkProps extends React.AnchorHTMLAttributes<any> {
  to?: string
  onAction?: () => void
}

const pickArea = pickBy((v, k) => startsWith('area-', k))

export function Link(props: LinkProps) {
  const onClick = event => {
    if (props.onAction) {
      event.preventDefault()
      props.onAction()
    }
  }

  return (
    <a
      href={props.to || '#'}
      className={props.className}
      onClick={onClick}
      tabIndex={props.tabIndex}
      title={props.title}
      role={props.role}
      {...pickArea(props)}
    >
      {props.children}
    </a>
  )
}
