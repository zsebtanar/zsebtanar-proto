import React from 'react'
import { UseModelProps } from '../../../hooks/model'

interface Props
  extends UseModelProps<string>,
    Omit<React.HTMLProps<HTMLInputElement>, 'value' | 'onChange' | 'name'> {}

export function Input({ name, value, onChange, ...props }: Props) {
  return (
    <input
      name={name}
      defaultValue={value}
      onChange={({ target }) => onChange({ name, value: target.value })}
      {...props}
    />
  )
}
