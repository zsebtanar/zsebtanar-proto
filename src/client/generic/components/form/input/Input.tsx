import React from 'react'
import { OnChange } from '../../../hooks/model'

interface Props extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> {
  onChange: OnChange<string>
}

export function Input({ value, onChange, ...props }: Props) {
  return (
    <input
      defaultValue={value}
      onChange={({ target }) => {
        onChange(target.name, target.value)
      }}
      {...props}
    />
  )
}
