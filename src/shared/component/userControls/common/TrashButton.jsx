import * as React from 'react'
import { Button } from 'shared/component/general/Button'

export const TrashButton = props => (
  <Button className="text-danger btn-sm btn-link" onAction={props.onAction}>
    <i className="fa fa-trash" /> {props.label || ''}
  </Button>
)
