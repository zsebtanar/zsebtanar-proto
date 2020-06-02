import React, { useRef } from 'react'
import * as cx from 'classnames'
import { UseModelProps } from '../../../hooks/model'
import { uid } from '../../../utils'

interface Props extends UseModelProps<unknown> {
  inputValue: unknown
  className?: string
  children?: React.ReactNode
}

export function RadioInput({
  children,
  name,
  value,
  onChange,
  className,
  inputValue,
  ...props
}: Props) {
  const id = useRef<string>(`radio-${uid()}`)
  return (
    <div className={cx('custom-control', 'custom-radio', className)}>
      <input
        {...props}
        id={id.current}
        type="radio"
        name={name}
        checked={value === inputValue}
        onChange={({ target }) => target.checked && onChange({ name, value: inputValue })}
        className="custom-control-input"
      />
      <label className="custom-control-label" htmlFor={id.current}>
        {children}
      </label>
    </div>
  )
}
