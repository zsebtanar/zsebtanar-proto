import * as React from 'react'
import { pickBy, startsWith } from 'ramda'

const pickArea = pickBy((v, k) => startsWith('area-', k))

export default function Button (props) {
  const onClick = (event) => {
    if (props.onAction) {
      event.preventDefault()
      props.onAction(event)
    }
  }

  return (<button
    type={props.submit ? 'submit' : 'button'}
    className={`btn ${props.className || (props.primary ? 'btn-primary' : (props.info ?  'btn-warning' : 'btn-secondary'))}`}
    onClick={onClick}
    tabIndex={props.tabIndex}
    title={props.title}
    disabled={props.disabled || props.loading}
    {...pickArea(props)}
  >
    {props.icon && <i className={`fa fa-${props.icon} fa-fw mr-1`}/>}
    {props.children}
    {props.loading && <i className="fa fa-cog fa-spin fa-fw"/>}
  </button>)
}
