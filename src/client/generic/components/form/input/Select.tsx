import React from 'react'
import { UseModelProps } from '../../../hooks/model'

interface Props<T>
  extends UseModelProps<T>,
    Omit<React.HTMLProps<HTMLSelectElement>, 'value' | 'onChange' | 'name'> {
  options: { label: string; value: T }[]
}

export function Select<T>({
  name,
  value: selectedValue,
  onChange,
  options,
  ...props
}: Props<T>): JSX.Element {
  return (
    <select
      name={name}
      onChange={({ target }) =>
        onChange({ name, value: options[parseInt(target.value, 10)]?.value })
      }
      {...props}
      value={selectedValue as any}
    >
      {options.map(({ label, value }, idx) => (
        <option key={idx} value={String(value)}>
          {label}
        </option>
      ))}
    </select>
  )
}
