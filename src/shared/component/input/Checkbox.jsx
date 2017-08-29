import * as React from 'react'

export default (props) => (
  <label className={`custom-control custom-checkbox ${props.className}`}>
    <input
      type="checkbox"
      className="custom-control-input"
      name={props.name}
      checked={props.checked}
      onChange={props.onChange}
    />
    <span className="custom-control-indicator"/>
    <span className="custom-control-description">{props.children}</span>
  </label>
)
