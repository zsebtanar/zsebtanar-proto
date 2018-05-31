import { pipe } from 'ramda'
import React from 'react'
import {Button} from 'shared/component/general/Button'
import { UserControls } from 'shared/component/userControls/UserControl'
import { NAMES as CONTROL_TYPES } from 'shared/component/userControls/controlTypes'

export class UserControlItem extends React.Component {
  render() {
    const {
      data,
      index,
      editControl,
      removeControl,
      connectDragPreview,
      connectDragSource,
      connectDropTarget,
      isDragging,
      resources,
      solutions
    } = this.props
    const [id, itemData] = data

    const opacity = isDragging ? 0 : 1

    return pipe(connectDropTarget, connectDragPreview)(
      <div className="list-group-item list-group-item-action flex-column align-items-start" style={{opacity}}>
        <div className="d-flex w-100 justify-content-between">
          <div className="mb-1 text-muted">
            <span className="badge badge-pill badge-secondary">{index + 1}.</span>
            <span className="px-2">-</span>
            {CONTROL_TYPES[itemData.controlType]}
          </div>
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
        <UserControls {...itemData} value={solutions && solutions[id]} resources={resources} />
      </div>
    )
  }
}
