import React from 'react'
import { FieldModelProps } from 'client/generic/types'

export function TextInput({ name, value, onChange }: FieldModelProps<string, never>) {
  return (
    <input
      name={name}
      defaultValue={value}
      onChange={event => onChange(name, event.target.value)}
    />
  )
}
