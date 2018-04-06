import React from 'react'
import { Markdown } from 'shared/component/general/Markdown'

export function SingleNumber(props) {
  const setSolution = e => {
    if (props.onChange) {
      props.onChange({
        name: props.name,
        value: e.currentTarget.value
      })
    }
  }

  return (
    <div className="user-control single-number d-flex align-items-center">
      <span className="prefix">
        <Markdown source={props.prefix} resources={props.resources} />
      </span>
      {props.readOnly ? (
        <strong>&nbsp;{props.value}&nbsp;</strong>
      ) : (
        <input
          name={props.name}
          type="number"
          className="form-control col-4 mx-1"
          onChange={setSolution}
          step={1 / Math.pow(10, props.fractionDigits || 0)}
        />
      )}
      <span className="postfix">
        <Markdown source={props.postfix} resources={props.resources} />
      </span>
    </div>
  )
}
