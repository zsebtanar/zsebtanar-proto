import React, { useRef } from 'react'
import cx from 'classnames'
import { UseModelProps } from '../../../hooks/model'
import { uid } from '../../../../../shared/utils/fn'

interface Props<TValue>
  extends UseModelProps<TValue>,
    Omit<React.HTMLProps<HTMLInputElement>, 'value' | 'onChange' | 'name'> {
  inputValue: TValue
  className?: string
  children?: React.ReactNode
}

export function RadioInput<TValue>({
  children,
  name,
  value,
  onChange,
  className,
  inputValue,
  ...props
}: Props<TValue>): JSX.Element {
  const id = useRef<string>(`radio-${uid()}`)
  return (
    <div
      className={cx('custom-control', 'custom-radio', className, { checked: value === inputValue })}
    >
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
