import * as React from 'react'

export default function Button(props){

  const onClick = (event) => {
    if (props.onAction){
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
  >
    {props.children}
  </button>)
}