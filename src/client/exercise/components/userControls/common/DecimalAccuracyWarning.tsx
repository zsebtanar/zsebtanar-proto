import React from 'react'

interface Props {
  fractionDigits: number
}

export function DecimalAccuracyWarning({ fractionDigits }: Props): JSX.Element {
  return (
    <small className="form-text text-warning">
      Kérlek, {fractionDigits} tizedesjegy pontossággal add meg a megoldást.
    </small>
  )
}
