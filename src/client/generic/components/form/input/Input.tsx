import React from 'react'
import { UseModelProps } from '../../../hooks/model'

export interface InputProps
  extends UseModelProps<string>,
    Omit<React.HTMLProps<HTMLInputElement>, 'value' | 'onChange' | 'name'> {}

export function Input({ name, value, onChange, ...props }: InputProps): JSX.Element {
  if (props.disabled) {
    props['value'] = value
  } else {
    props.defaultValue = value
  }

  return (
    <input
      name={name}
      onChange={({ target }) => onChange({ name, value: target.value })}
      {...props}
    />
  )
}
