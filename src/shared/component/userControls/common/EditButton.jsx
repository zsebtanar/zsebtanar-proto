import Button from 'shared/component/general/Button'
import * as React from 'react'

export default (props) => (
  <Button className="btn-sm btn-link" onAction={props.onAction}>
    <i className="fa fa-edit"/>
  </Button>
)
