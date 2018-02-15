import * as React from 'react'
import { uid } from 'shared/util/uuid'

export default props => {
  const id = `cc-${uid()}`
  return (
    <div className={`custom-control custom-checkbox ${props.className}`}>
      <input
        type="checkbox"
        className="custom-control-input"
        name={props.name}
        checked={props.checked}
        onChange={props.onChange}
        id={id}
      />
      <label className="custom-control-label" htmlFor={id}>
        {props.children}
      </label>
    </div>
  )
}
