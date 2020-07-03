import React from 'react'
import { UseModelProps } from '../../../hooks/model'

interface Props
  extends UseModelProps<number>,
    Omit<React.HTMLProps<HTMLInputElement>, 'value' | 'onChange' | 'name' | 'type'> {}

export function NumberInput({ name, value, onChange, ...props }: Props): JSX.Element {
  return (
    <input
      name={name}
      type="number"
      defaultValue={value}
      onChange={({ target }) => onChange({ name, value: parseFloat(target.value) })}
      {...props}
    />
  )
}
