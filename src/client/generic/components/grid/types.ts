import React, { MouseEvent } from 'react'

export type GridColumnRenderer<T, D = unknown> = (
  data: D | undefined,
  row: T,
  rowIdx: number,
  colIdx: number
) => React.ReactNode

export type RowActionFn<T> = (event: MouseEvent, rowData: T) => void

export interface GridColumnDefinition<T> {
  key?: string
  title: string
  className?: string
  width?: number
  renderer?: GridColumnRenderer<T>
}

export interface InternalGridColumnDefinition<T> extends GridColumnDefinition<T> {
  _id: string
  renderer: GridColumnRenderer<T>
}
