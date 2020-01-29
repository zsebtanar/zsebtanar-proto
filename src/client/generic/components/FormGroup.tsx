import React, { ReactElement } from 'react'
import { uid } from 'client/generic/utils'

interface Props {
  label: string
  col?: number
  helpText?: string
  className?: string
  children?: React.ReactNode
}

export function FormGroup({ helpText, label, children, col, className }: Props) {
  const column = col || 4
  const colAlt = 12 - column
  const id = `fg-${uid()}`

  return (
    <div className={`form-group row ${className || ''}`}>
      <label className={`col-${column} col-form-label`} htmlFor={id}>
        {label}
      </label>
      <div className={`col-${colAlt}`}>
        {React.Children.map(children, child => React.cloneElement(child as ReactElement, { id }))}
        {helpText && <small className="form-text text-muted">{helpText}</small>}
      </div>
    </div>
  )
}
