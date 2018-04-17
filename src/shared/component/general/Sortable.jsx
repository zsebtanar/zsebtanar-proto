import React from 'react'
import { DragDropContext, DropTarget, DragSource } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { insert, pipe, prop, remove } from 'ramda'
import { findDOMNode } from 'react-dom'
import { uid } from '../../util/uuid'

function sortableList(list) {
  return (list || []).map(data => ({ id: uid(), data }))
}

function unwrapSortableList(list) {
  return (list || []).map(prop('data'))
}

function itemSource(ctx) {
  return {
    beginDrag(props) {
      return {
        index: props.index,
        originalIndex: props.index
      }
    },

    endDrag(props, monitor) {
      ctx.dndFinish(monitor.getItem())
    }
  }
}

function itemTarget(ctx) {
  return {
    hover(props, monitor, component) {
      const dragIndex = monitor.getItem().index
      const hoverIndex = props.index

      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      ctx.moveItem(dragIndex, hoverIndex)

      monitor.getItem().index = hoverIndex
    }
  }
}

function sortableItem(component, ctx) {
  return pipe(
    DropTarget(ctx.itemType, itemTarget(ctx), connect => ({
      connectDropTarget: connect.dropTarget()
    })),
    DragSource(ctx.itemType, itemSource(ctx), (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging()
    }))
  )(component)
}

export const Sortable = DragDropContext(HTML5Backend)(
  class extends React.Component {
    state = { list: [] }

    constructor(props) {
      super(props)
      this.itemType = `sortable-${uid()}`
      this.ItemComponent = sortableItem(props.itemComponent, this)
      this.state.list = sortableList(props.list)
    }

    moveItem = (dragIdx, hoverIdx) => {
      const list = this.state.list

      this.setState({ list: pipe(remove(dragIdx, 1), insert(hoverIdx, list[dragIdx]))(list) })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps && (!prevState || nextProps.list !== prevState.list)) {
        return { list: sortableList(nextProps.list) }
      }
      return null
    }

    dndFinish(lastItem) {
      const { onChange } = this.props
      if (onChange) onChange(unwrapSortableList(this.state.list), lastItem)
    }

    render() {
      const Container = this.props.elementType || 'div'

      return (
        <Container className={`sortable-list ${this.props.className}`}>
          {this.state.list.map(this.renderItem)}
        </Container>
      )
    }

    renderItem = ({ id, data }, idx) => {
      const ItemComponent = this.ItemComponent
      return <ItemComponent index={idx} key={id} data={data} {...this.props.itemProps} />
    }
  }
)
