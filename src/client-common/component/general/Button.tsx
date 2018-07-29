import { pickBy, startsWith } from 'ramda'
import * as React from 'react'

interface ButtonProps {
  title?: string
  className?: string
  icon?: string
  disabled?: boolean
  loading?: boolean
  primary?: boolean
  secondary?: boolean
  info?: boolean
  submit?: boolean
  tabIndex?: number
  onAction?: (event:MouseEvent) => void
  children?: React.ReactNode
}

const pickArea = pickBy((v, k) => startsWith('area-', k))

export function Button(props: ButtonProps) {
  const onClick = event => {
    if (props.onAction) {
      event.preventDefault()
      props.onAction(event)
    }
  }

  return (
    <button
      type={props.submit ? 'submit' : 'button'}
      className={`btn ${props.className ||
        (props.primary ? 'btn-primary' : props.info ? 'btn-warning' : 'btn-secondary')}`}
      onClick={onClick}
      tabIndex={props.tabIndex}
      title={props.title}
      disabled={props.disabled || props.loading}
      {...pickArea(props)}
    >
      {props.icon && <i className={`fa fa-${props.icon} fa-fw mr-1`} />}
      {props.children}
      {props.loading && <i className="fa fa-cog fa-spin fa-fw" />}
    </button>
  )
}
