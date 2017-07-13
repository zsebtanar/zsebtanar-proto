import React from 'react'
import Markdown from '../../general/Markdown'

export default function (props) {
  const setSolution = (e) => {
    if (props.onChange) {
      props.onChange({
        name: props.name,
        value: e.currentTarget.value
      })
    }
  }

  return (<div className="user-control simple-text d-flex align-items-center">
    <span className="prefix">
      <Markdown source={props.prefix}/>
    </span>
    <input name={props.name} type="text" className="form-control" onChange={setSolution}/>
    <span className="postfix">
      <Markdown source={props.postfix}/>
    </span>
  </div>)
}
