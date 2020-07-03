import React, { useRef } from 'react'
import { Input, InputProps } from './input/Input'
import { uid } from '../../utils/fn'

import './FormGroupLabel.scss'

interface Props extends Omit<InputProps, 'id' | 'placeholder'> {
  label: string
}

export function FormGroupLabel({ label, ...props }: Props): JSX.Element {
  const id = useRef(`fgl-${uid()}`)
  return (
    <div className="form-label-group">
      <Input {...props} id={id.current} placeholder={label} />
      <label htmlFor={id.current}>{label}</label>
    </div>
  )
}
