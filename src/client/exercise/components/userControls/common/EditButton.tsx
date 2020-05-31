import * as React from 'react'
import { Button } from 'client-common/component/general/Button'

export const EditButton = props => (
  <Button className="btn-sm btn-link" onAction={props.onAction}>
    <i className="fa fa-edit" />
  </Button>
)
