import React, { useRef } from 'react'
import * as cx from 'classnames'
import { UseModelProps } from '../../../hooks/model'
import { uid } from '../../../utils'

interface Props extends UseModelProps<boolean> {
  className?: string

  children?: React.ReactNode
}

export function RadioInput({ children, name, value, onChange, className, ...props }: Props) {
  const id = useRef<string>(`radio-${uid()}`)
  return (
    <div className={cx('custom-control', 'custom-radio', className)}>
      <input
        {...props}
        id={id.current}
        type="radio"
        name={name}
        checked={value}
        onChange={({ target }) => onChange({ name, value: target.checked })}
        className="custom-control-input"
      />
      <label className="custom-control-label" htmlFor={id.current}>
        {children}
      </label>
    </div>
  )
}
