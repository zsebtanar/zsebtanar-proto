import {
  GridColumnDefinition,
  InternalGridColumnDefinition,
} from 'client/generic/components/grid/types'
import { uid } from 'client/generic/utils/fn'

export function genColumnDefs<T>(
  list?: T[],
  customDefs: GridColumnDefinition<T>[] = [],
): InternalGridColumnDefinition<T>[] {
  let columns
  if (customDefs?.length) {
    return customDefs.map((def) => ({
      ...{ renderer: defaultColumnRenderer },
      ...def,
      ...{ _id: uid() },
    }))
  } else {
    if (!list?.length) return []

    const firstRecord = list[0]
    columns = Object.keys(firstRecord)
    return columns.map((key) => ({ _id: uid(), key, title: key, renderer: defaultColumnRenderer }))
  }
}

export const defaultColumnRenderer = (data: unknown) => String(data)
