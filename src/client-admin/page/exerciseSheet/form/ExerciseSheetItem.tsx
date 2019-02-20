import { Badge } from 'client-common/component/general/Badge'
import { Button } from 'client-common/component/general/Button'
import { Markdown } from 'client-common/component/general/Markdown'
import { SortableListItemProps } from 'client-common/component/general/Sortable'
import { pipe } from 'ramda'
import * as React from 'react'

interface Props extends SortableListItemProps {
  openRemoveExercise: (key: string) => () => void
}

export class ExerciseSheetItem extends React.PureComponent<Props> {
  render(): React.ReactNode {
    const {
      data,
      index,
      openRemoveExercise,
      connectDragPreview,
      connectDragSource,
      connectDropTarget,
      isDragging
    } = this.props

    const opacity = isDragging ? 0 : 1

    return pipe(
      connectDropTarget,
      connectDragPreview
    )(
      <div
        key={data._key}
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
              onAction={openRemoveExercise(data._key)}
            />
            {connectDragSource(<i className="fa fa-arrows" aria-hidden="true" />)}
          </div>
        </div>
        <div key={data._key} className="d-flex flex-column align-items-start">
          <div className="mb-1 d-flex w-100 ">
            <Markdown source={data.description} />
          </div>
          <div>
            {this.renderBadge(data, 'grade', 'light')}
            {this.renderBadge(data, 'subject', 'primary')}
            {this.renderBadge(data, 'topic', 'info')}
            {this.renderBadge(data, 'tags', 'secondary')}
          </div>
        </div>
      </div>
    )
  }
  private renderBadge(exercise, key, type) {
    return (exercise[key] || []).map(item => <Badge type={type}>{item}</Badge>)
  }
}
