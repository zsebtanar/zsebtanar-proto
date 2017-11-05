import React from 'react'
import Icon from 'shared/component/general/Icon'

export default props => {
  switch (props.value) {
    case 'active':
      return (
        <span className="badge badge-pill badge-success" title="Aktív">
          {props.short ? <Icon fa='check'/> : 'Aktív'}
        </span>
      )
    case 'archive':
      return (
        <span className="badge badge-pill badge-dark" title="Arhivált">
          {props.short ? <Icon fa='archive'/> : 'Arhivált'}
        </span>
      )
    case 'draft':
    default:
      return (
        <span className="badge badge-pill badge-warning" title="Vázlat">
          {props.short ? <Icon fa='pencil'/> : 'Vázlat'}
        </span>
      )
  }
}
