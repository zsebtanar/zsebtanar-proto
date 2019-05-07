import { Icon } from '../../general/Icon'
import * as React from 'react'

export const DecimalAccuracyWarning = ({ fractionDigits }) => (
  <small className="form-text text-warning">
    <Icon fa="exclamation-triangle" /> Kérlek, {fractionDigits} tizedesjegy pontossággal
    add meg a megoldást.
  </small>
)
