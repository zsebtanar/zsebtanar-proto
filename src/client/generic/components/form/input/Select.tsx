import React from 'react'
import { UseModelProps } from '../../../hooks/model'

interface Props
  extends UseModelProps<unknown>,
    Omit<React.HTMLProps<HTMLSelectElement>, 'value' | 'onChange' | 'name'> {
  options: { label: string; value: unknown }[]
}

export function Select({ name, value: selectedValue, onChange, options, ...props }: Props) {
  return (
    <select
      name={name}
      onChange={({ target }) =>
        onChange({ name, value: options[parseInt(target.value, 10)]?.value })
      }
      {...props}
    >
      {options.map(({ label }, idx) => (
        <option key={idx} value={idx} selected={selectedValue === options[idx].value}>
          {label}
        </option>
      ))}
    </select>
  )
}
