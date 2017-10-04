import * as React from 'react'

export default function Icon(props) {
  const size = props.size ? 'fa-' + props.size : ''
  const className = props.className || ''
  return (
    <i className={`fa fa-${props.fa} ${size} ${className}`} aria-hidden="true">
      {props.children}
    </i>
  )
}
