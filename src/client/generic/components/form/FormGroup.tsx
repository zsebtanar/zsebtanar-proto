import React, { useRef } from 'react'
import { uid } from '../../utils'

interface Props {
  label: React.ReactNode
  children: (id: string) => React.ReactNode
}

export function FormGroup({ children, label }: Props) {
  const id = useRef(`fg-${uid()}`)
  return (
    <div className="form-group">
      <label htmlFor={id.current}>{label}</label>
      {children(id.current)}
    </div>
  )
}
