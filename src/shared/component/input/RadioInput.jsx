import * as React from 'react'

export default (props) => (
  <label className="custom-control custom-radio">
    <input
      type="radio"
      className="custom-control-input"
      name={props.name}
      value={props.value}
      checked={props.checked}
      required={props.required}
      onChange={props.onChange}
    />
    <span className="custom-control-indicator"/>
    <span className="custom-control-description">{props.children}</span>
  </label>
)
