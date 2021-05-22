import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { UseModelProps } from '../hooks/model'
import { uid } from '../../../shared/utils/fn'

export interface Props<Item> extends UseModelProps<Item[]> {
  children(details: { key: string; item: Item; index: number }): React.ReactNode
}

interface WrappedData<Item> {
  item: Item
  key: string
}

export function SortableList<Item>({ name, value, onChange, children }: Props<Item>) {
  const [items, setItems] = useState<WrappedData<Item>[]>([])

  useEffect(() => {
    setItems((value ?? []).map((item) => ({ item, key: uid() })))
  }, [value.length])

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    setItems((items) => {
      const newItems = reorder(items, result.source.index, result.destination.index)
      onChange({ name, value: newItems.map(({ item }) => item) })
      return newItems
    })
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={snapshot.isDraggingOver ? 'dragging-over' : ''}
          >
            {items.map((item, index) => (
              <Draggable key={item.key} draggableId={item.key} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? 'dragging' : ''}
                    style={provided.draggableProps.style}
                  >
                    {children({ ...item, index })}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

// a little function to help us with reordering the result
const reorder: <T>(list: T[], startIndex: number, endIndex: number) => T[] = (
  list,
  startIndex,
  endIndex,
) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
