import React from 'react'
import { RowActionFn, InternalGridColumnDefinition } from './types'
import { BaseModel } from 'client/generic/services'

interface Props<T> {
  list: T[]
  rowAction?: RowActionFn<T>
  columnDefs: InternalGridColumnDefinition<T>[]
}

export function GridBody<T extends BaseModel>({ list, rowAction, columnDefs }: Props<T>) {
  return (
    <tbody>
      {list.map((rowData, rIdx) => {
        const action = rowAction && (e => rowAction(e, rowData))
        return (
          <tr key={rowData.id} onClick={action}>
            {columnDefs.map((def, cIdx) => {
              const cellData = def.key && rowData[def.key]
              return <td key={def._id}>{def.renderer(cellData, rowData, rIdx, cIdx)}</td>
            })}
          </tr>
        )
      })}
    </tbody>
  )
}
