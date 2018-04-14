import { pipe } from 'ramda'
import React from 'react'
import Button from 'shared/component/general/Button'
import { UserControls } from 'shared/component/userControls/UserControl'
import { NAMES as CONTROL_TYPES } from 'shared/component/userControls/controlTypes'

export const UserControlItem = class extends React.Component {
  render() {
    const {
      data,
      editControl,
      removeControl,
      connectDragPreview,
      connectDragSource,
      connectDropTarget,
      isDragging
    } = this.props
    const [id, itemData] = data

    const opacity = isDragging ? 0 : 1

    return pipe(connectDropTarget, connectDragPreview)(
      <div className="list-group-item list-group-item-action flex-column align-items-start" style={{opacity}}>
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1 text-muted">
            <small className="text-muted">{CONTROL_TYPES[itemData.controlType]}</small>
          </h5>
          <div>
            <Button
              icon="trash"
              className="btn-sm btn-link text-danger"
              onAction={removeControl(id)}
            />
            {connectDragSource(<i className="fa fa-arrows" aria-hidden="true" />)}
            <Button icon="edit" className="btn-sm btn-link" onAction={editControl(id)}>
              Módosítás
            </Button>
          </div>
        </div>
        <UserControls {...itemData} resources={this.props.resources} />
      </div>
    )
  }
}
