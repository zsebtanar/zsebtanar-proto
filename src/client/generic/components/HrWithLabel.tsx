import React from 'react'

import './HrWithLabel.scss'

interface Props {
  label: string
}

export function HrWithLabel({ label }: Props): JSX.Element {
  return (
    <div className="hr-with-text">
      <div className="line" />
      <div className="label">{label}</div>
      <div className="line" />
    </div>
  )
}
