import * as React from 'react'
import { pipe } from 'ramda'
import { Button } from 'client-common/component/general/Button'
import { Icon } from 'client-common/component/general/Icon'
import { Markdown } from 'client-common/component/general/Markdown'

export class HintItem extends React.Component<any, any> {
  render() {
    const {
      data,
      index,
      openUpdateHint,
      openRemoveHint,
      resources,
      connectDragPreview,
      connectDragSource,
      connectDropTarget,
      isDragging
    } = this.props
    const [id, itemData] = data

    const opacity = isDragging ? 0 : 1

    return pipe(
      connectDropTarget,
      connectDragPreview
    )(
      <div
        className="list-group-item list-group-item-action flex-column align-items-start"
        style={{ opacity }}
      >
        <div className="d-flex w-100 justify-content-between">
          <div className="mb-1">
            <span className="badge badge-pill badge-secondary">{index + 1}.</span>
          </div>
          <div>
            <Button
              className="btn-sm btn-link text-danger"
              icon="trash"
              onAction={openRemoveHint(id)}
            />
            {connectDragSource(<i className="fa fa-arrows" aria-hidden="true" />)}
            <Button className="btn-sm btn-link" onAction={openUpdateHint(id)}>
              <Icon fa="edit" /> Módosítás
            </Button>
          </div>
        </div>
        <Markdown source={itemData.text} resources={resources} />
      </div>
    )
  }
}
