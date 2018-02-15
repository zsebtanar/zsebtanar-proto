import * as React from 'react'
import { uid } from 'shared/util/uuid'

export default props => {
  const id = `cc-${uid()}`
  return (
    <div className="custom-control custom-radio">
      <input
        type="radio"
        className="custom-control-input"
        name={props.name}
        value={props.value}
        checked={props.checked}
        required={props.required}
        onChange={props.onChange}
        id={id}
      />
      <label className="custom-control-label" htmlFor={id}>
        {props.children}
      </label>
    </div>
  )
}
