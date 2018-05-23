import React from 'react'
import { Markdown } from 'shared/component/general/Markdown'

export function SimpleText(props) {
  const setSolution = e => {
    if (props.onChange) {
      props.onChange({
        name: props.name,
        value: e.currentTarget.value
      })
    }
  }

  return (
    <div className="user-control simple-text d-flex align-items-center">
      <span className="prefix">
        <Markdown source={props.prefix} resources={props.resources} />
      </span>

      {props.readOnly ? (
        <strong>&nbsp;{props.value !== undefined ? props.value : undefined}&nbsp;</strong>
      ) : (
        <input
          name={props.name}
          type="text"
          className="form-control col-4 mx-1"
          value={props.value !== undefined ? (props.value.hasOwnProperty("options") ? Object.values(props.value.options).join("; ") : props.value
          ) : undefined}
          onChange={setSolution}
        />
      )}
      <span className="postfix">
        <Markdown source={props.postfix} resources={props.resources} />
      </span>
    </div>
  )
}
