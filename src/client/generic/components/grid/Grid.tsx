import React, { useState, useEffect } from 'react'
import { BaseModel } from 'client/generic/services'
import { Alert } from '../Alert'
import { Loading } from '../Loading'
import { GridPagination } from './GridPagination'
import { GridHeader } from './GridHeader'
import { useGridDS } from './gridProvider'
import { GridBody } from './GridBody'
import { genColumnDefs } from './utis'
import { GridColumnDefinition, InternalGridColumnDefinition, RowActionFn } from './types'

interface Props<T> {
  className?: string
  dataSource: GridDataSource<T>
  columnDefs: GridColumnDefinition<T>[]
  defaultPageSize?: number
  rowAction?: RowActionFn<T>
}

export function Grid<T extends BaseModel>({ dataSource, columnDefs, rowAction, defaultPageSize }: Props<T>) {
  const [pageNum, setPageNum] = useState<number>(0)
  const [colDefs, setColDefs] = useState<InternalGridColumnDefinition<T>[]>([])
  const { isPending, isLoading, error, hasNoResult, result } = useGridDS<T>(
    dataSource,
    pageNum,
    defaultPageSize || 25
  )

  useEffect(() => {
    if (colDefs.length === 0) {
      setColDefs(genColumnDefs(result?.list, columnDefs))
    }
  })

  if (isLoading || isPending) {
    return (
      <div>
        <Loading />
      </div>
    )
  } else if (error) {
    return <Alert type={'danger'}>Hiba: {JSON.stringify(error)}</Alert>
  } else if (hasNoResult) {
    return <Alert type={'info'}>A lista üres</Alert>
  } else if (!colDefs?.length) {
    return <Alert type={'info'}>Nincsenek oszlopai a listának</Alert>
  } else {
    return (
      <div>
        <table className="table table-hover table-sm mt-3">
          <GridHeader columnDefs={colDefs} />
          <GridBody columnDefs={colDefs} list={result?.list ?? []} rowAction={rowAction} />
        </table>
        <GridPagination
          current={pageNum}
          length={result?.numberOfPage ?? 0}
          next={() => setPageNum(pageNum + 1)}
          prev={() => setPageNum(pageNum - 1)}
          jump={num => setPageNum(num)}
        />
      </div>
    )
  }
}

///
