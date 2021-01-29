import React from 'react'
import { UseModelProps } from '../../../hooks/model'

export interface InputProps
  extends UseModelProps<string>,
    Omit<React.HTMLProps<HTMLInputElement>, 'value' | 'onChange' | 'name'> {}

export function Input({ name, value, onChange, ...props }: InputProps): JSX.Element {
  return (
    <input
      name={name}
      defaultValue={value}
      onChange={({ target }) => onChange({ name, value: target.value })}
      {...props}
    />
  )
}
