import * as React from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import {
  DragDropContext,
  DragSource,
  DragSourceConnector,
  DropTarget,
  DropTargetConnector
} from 'react-dnd'
import { insert, pipe, prop, remove } from 'ramda'
import { findDOMNode } from 'react-dom'
import { uid } from '../../util/uuid'

///

export interface SortableListItem {
  id: string
  data: any
}

export interface SortableListItemProps extends SortableListItem {
  index: number
  connectDragPreview: ReturnType<DragSourceConnector['dragPreview']>
  connectDragSource: ReturnType<DragSourceConnector['dragSource']>
  connectDropTarget: ReturnType<DropTargetConnector['dropTarget']>
  isDragging: () => boolean
}

interface SortableProps {
  className?: string
  list: any[]
  idFn?: (any) => string
  elementType?: string
  itemProps?: any
  itemComponent: React.ReactNode
  onChange: (list: [any], lastItem: any) => void
}

interface SortableState {
  list: SortableListItem[]
  originalList: any[]
}

///

function defaultIdfn(data) {
  return data && (data.id || data._key || data[0])
}

function sortableList(list = [], idFn = defaultIdfn) {
  return list.map(data => {
    const id = idFn(data)
    if (!id) throw new Error(`Invalid sort item's id`)
    return { id, data }
  })
}

function unwrapSortableList(list) {
  return (list || []).map(prop('data'))
}

function itemSource(ctx) {
  return {
    beginDrag(props) {
      return {
        id: props.id,
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
      if (!component) return null

      const dragIndex = monitor.getItem().index
      const hoverIndex = props.index

      if (dragIndex === hoverIndex) return
      const hoverBoundingRect = (findDOMNode(component) as Element).getBoundingClientRect()
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

function sortableItem(component, ctx /*: Sortable*/) {
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

///

export const Sortable = DragDropContext(HTML5Backend)(
  class extends React.Component<SortableProps, SortableState> {
    state = { list: [], originalList: [] }

    public itemType
    private readonly ItemComponent

    constructor(props) {
      super(props)
      this.itemType = `sortable-${uid()}`
      this.ItemComponent = sortableItem(props.itemComponent, this)
      this.state.originalList = props.list
      this.state.list = sortableList(props.list, props.idFn)
    }

    moveItem = (dragIdx, hoverIdx) => {
      const list = this.state.list

      this.setState({
        list: pipe(
          remove(dragIdx, 1),
          insert(hoverIdx, list[dragIdx])
        )(list)
      })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.list !== prevState.originalList) {
        return { list: sortableList(nextProps.list, nextProps.idFn), originalList: nextProps.list }
      } else {
        return { list: prevState.list }
      }
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
