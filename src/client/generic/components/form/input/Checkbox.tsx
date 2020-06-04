import React, { useRef } from 'react'
import * as cx from 'classnames'
import { UseModelProps } from '../../../hooks/model'
import { uid } from '../../../utils'

interface CheckboxProps
  extends UseModelProps<boolean>,
    Omit<React.HTMLProps<HTMLInputElement>, 'value' | 'onChange' | 'name'> {
  className?: string
  children?: React.ReactNode
}

export function Checkbox({ name, value, onChange, className, children, ...props }: CheckboxProps) {
  const id = useRef<string>(`radio-${uid()}`)
  return (
    <div className={cx('custom-control', 'custom-checkbox', className)}>
      <input
        {...props}
        id={id.current}
        type="checkbox"
        name={name}
        checked={value ?? false}
        onChange={({ target }) => onChange({ name, value: target.checked })}
        className="custom-control-input"
      />
      <label className="custom-control-label" htmlFor={id.current}>
        {children}
      </label>
    </div>
  )
}
