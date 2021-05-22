import React, { useEffect } from 'react'
import { UseModelProps } from '../../../hooks/model'

interface Props
  extends UseModelProps<number>,
    Omit<
      React.HTMLProps<HTMLInputElement>,
      'value' | 'onChange' | 'name' | 'type' | 'defaultValue'
    > {
  defaultValue?: number
}

export function NumberInput({ name, value, onChange, defaultValue, ...props }: Props): JSX.Element {
  useEffect(() => {
    if (value === undefined && defaultValue !== undefined) {
      onChange({ name, value: defaultValue })
    }
  })
  if (props.disabled) {
    props['value'] = value
  } else {
    props['defaultValue'] = value
  }

  return (
    <input
      name={name}
      type="number"
      onChange={({ target }) => onChange({ name, value: parseFloat(target.value) })}
      {...props}
    />
  )
}
