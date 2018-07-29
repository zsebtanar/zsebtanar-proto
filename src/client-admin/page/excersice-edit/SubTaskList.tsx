import * as React from 'react'
import { assocPath, dissoc, evolve, flip, fromPairs, merge, pipe, values } from 'ramda'
import { uid } from 'client-common/util/uuid'
import { indexedMap, pairsInOrder } from 'shared/util/fn'
import { Button } from 'client-common/component/general/Button'
import { Icon } from 'client-common/component/general/Icon'
import { Sortable } from 'client-common/component/general/Sortable'
import { SubTask } from './SubTask'

function subTaskTitle(idx) {
  return `${idx + 1}. rész`
}

const updateOrderAndTitle = (pair, idx) =>
  pipe(
    assocPath([1, 'order'], idx),
    assocPath([1, 'title'], subTaskTitle(idx))
  )(pair)

function fixSubTaskTitleAndOrder(subTasksObj) {
  return pipe(
    pairsInOrder,
    indexedMap(updateOrderAndTitle),
    fromPairs
  )(subTasksObj)
}

export class SubTaskList extends React.Component<any, any> {
  state = {
    activeTabIndex: 0,
    subTasks: []
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps && nextProps.subTasks !== prevState.subTasks) {
      return {
        ...prevState,
        subTasks: pairsInOrder(nextProps.subTasks) || []
      }
    }
    return null
  }

  addSubTask = () =>
    this.setValue(
      evolve({
        subTasks: subTasks => {
          const order = values(subTasks).length
          return {
            ...fixSubTaskTitleAndOrder(subTasks),
            [uid()]: { order, title: subTaskTitle(order) }
          }
        }
      })
    )

  updateSubTask = key => subTask =>
    this.setValue(
      evolve({
        subTasks: { [key]: flip(merge)(subTask) }
      })
    )

  removeSubTask = key => () =>
    confirm('Biztosan, hogy törölni szeretnéd?') &&
    this.setValue(
      evolve({
        subTasks: pipe(
          dissoc(key),
          fixSubTaskTitleAndOrder
        )
      })
    )

  orderUpdate = (list, lastMove) => {
    this.setState({ activeTabIndex: lastMove.index })
    this.setValue(
      assocPath(
        ['subTasks'],
        pipe(
          indexedMap(updateOrderAndTitle),
          fromPairs
        )(list)
      )
    )
  }

  setValue = fn => {
    const data = fn({ subTasks: fromPairs(this.state.subTasks) })
    this.props.onChange(data.subTasks)
  }

  selectTask = activeTabIndex => () => {
    this.setState({ activeTabIndex })
  }

  render() {
    const { subTasks, activeTabIndex } = this.state
    return (
      <div>
        <div className="mb-2">
          <Button
            title="Új beviteli mező felvétele"
            className="btn btn-sm btn-outline-secondary"
            onAction={this.addSubTask}
          >
            <Icon fa="plus" /> Új részfeladat
          </Button>
        </div>
        <div className={`nav-vertical row ${this.props.className || ''}`}>
          <div className="col-3">
            <Sortable
              elementType="ul"
              className="nav flex-column nav-pills"
              list={subTasks}
              onChange={this.orderUpdate}
              itemComponent={SubTaskTab}
              itemProps={{
                onSelect: this.selectTask,
                onRemove: this.removeSubTask,
                activeTabIndex
              }}
            />
          </div>
          <div className="col-9">{this.renderTab(subTasks[activeTabIndex])}</div>
        </div>
      </div>
    )
  }

  renderTab = data => {
    if (data) {
      const [key, item] = data
      return <SubTask key={key} value={item} onChange={this.updateSubTask(key)} />
    }
  }
}

class SubTaskTab extends React.Component<any, any> {
  render() {
    const {
      index,
      activeTabIndex,
      data,
      onSelect,
      onRemove,
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
      <li className="nav-item" style={{ opacity }}>
        <div
          className={`nav-link d-flex w-100 justify-content-between ${
            activeTabIndex === index ? 'active' : ''
          }`}
          onClick={onSelect(index)}
        >
          <div>{itemData.title || subTaskTitle(index)}</div>
          <div>
            <Button icon="trash" className="btn-sm btn-link text-danger" onAction={onRemove(id)} />
            {connectDragSource(<i className="fa fa-arrows" aria-hidden="true" />)}
          </div>
        </div>
      </li>
    )
  }
}
