import React from 'react'
import { uid } from 'shared/util/uuid'

export default function FormGroup(props) {
  const col = props.col || 4
  const colAlt = 12 - col
  const id = `fg-${uid()}`

  return (
    <div className={`form-group row ${props.className}`}>
      <label className={`col-${col} col-form-label`} htmlFor={id}>
        {props.label}
      </label>
      <div className={`col-${colAlt}`}>
        {React.Children.map(props.children, child => React.cloneElement(child, { id }))}
      </div>
    </div>
  )
}
