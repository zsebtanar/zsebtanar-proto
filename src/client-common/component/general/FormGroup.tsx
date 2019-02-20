import * as React from 'react'
import { uid } from '../../util/uuid'
import { ReactElement } from 'react'

interface FormGroupProps {
  label: string
  col?: number
  helpText?: string
  className?: string
  children?: React.ReactNode
}

export function FormGroup(props: FormGroupProps) {
  const col = props.col || 4
  const colAlt = 12 - col
  const id = `fg-${uid()}`

  return (
    <div className={`form-group row ${props.className || ''}`}>
      <label className={`col-${col} col-form-label`} htmlFor={id}>
        {props.label}
      </label>
      <div className={`col-${colAlt}`}>
        {React.Children.map(props.children, child =>
          React.cloneElement(child as ReactElement<any>, { id })
        )}
        {props.helpText && <small className="form-text text-muted">{props.helpText}</small>}
      </div>
    </div>
  )
}
