import Button from 'shared/component/general/Button'
import * as React from 'react'

export default (props) => (
  <Button className="btn-sm btn-link" onAction={props.onAction}>
    <span className="text-danger"><i className="fa fa-trash"/></span>
  </Button>
)
