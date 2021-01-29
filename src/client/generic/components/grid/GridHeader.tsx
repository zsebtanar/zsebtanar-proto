import React from 'react'
import { InternalGridColumnDefinition } from './types'
import { BaseModel } from 'shared/generic/types'

interface Props<T> {
  columnDefs: InternalGridColumnDefinition<T>[]
}

export function GridHeader<T extends BaseModel>({ columnDefs }: Props<T>): JSX.Element {
  return (
    <thead className="thead-light">
      <tr>
        {columnDefs.map((def) => {
          const style = def.width ? { width: def.width } : undefined
          return (
            <th key={def._id} style={style} className={def.className}>
              {def.title}
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
