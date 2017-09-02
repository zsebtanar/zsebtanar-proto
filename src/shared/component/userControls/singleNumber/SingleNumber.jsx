import React from 'react'
import Markdown from 'shared/component/general/Markdown'

export default function (props) {
  const setSolution = (e) => {
    if (props.onChange) {
      props.onChange({
        name: props.name,
        value: e.currentTarget.value
      })
    }
  }

  return (<div className="user-control single-number d-flex align-items-center">
    <span className="prefix">
      <Markdown source={props.prefix}/>
    </span>
    <input name={props.name} type="number" className="form-control col-4 mx-1" onChange={setSolution}/>
    <span className="postfix">
      <Markdown source={props.postfix}/>
    </span>
  </div>)
}
