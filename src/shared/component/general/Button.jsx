import * as React from 'react'
import { pickBy, startsWith } from 'ramda'
import Loading from 'shared/component/general/Loading'

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
    className={`btn ${props.className || (props.primary ? 'btn-primary' : 'btn-secondary')}`}
    onClick={onClick}
    tabIndex={props.tabIndex}
    title={props.title}
    disabled={props.disabled || props.loading}
    {...pickArea(props)}
  >
    {props.children}
    {props.loading && <i className="fa fa-cog fa-spin fa-fw"/>}
  </button>)
}
