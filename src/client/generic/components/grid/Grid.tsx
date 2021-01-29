import React, { useEffect, useState } from 'react'
import { Alert } from '../Alert'
import { Loading } from '../Loading'
import { GridHeader } from './GridHeader'
import { useGridDS } from './gridProvider'
import { GridBody } from './GridBody'
import { genColumnDefs } from './utis'
import { GridColumnDefinition, InternalGridColumnDefinition, RowActionFn } from './types'
import { BaseModel, GridDataSource } from 'shared/generic/types'
import { Button } from '../Button'

interface Props<T> {
  className?: string
  dataSource: GridDataSource<T>
  columnDefs: GridColumnDefinition<T>[]
  defaultPageSize?: number
  rowAction?: RowActionFn<T>
  orderBy?: string
}

export function Grid<T extends BaseModel>({
  dataSource,
  columnDefs,
  rowAction,
  defaultPageSize,
}: Props<T>): JSX.Element {
  defaultPageSize = defaultPageSize || 25
  const [pageNum, setPageNum] = useState<number>(0)
  const [colDefs, setColDefs] = useState<InternalGridColumnDefinition<T>[]>([])
  const { isPending, isLoading, error, hasNoResult, result } = useGridDS<T>(
    dataSource,
    pageNum,
    defaultPageSize,
  )

  useEffect(() => {
    if (colDefs.length === 0) {
      setColDefs(genColumnDefs(result?.list, columnDefs))
    }
  }, [])

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
          <GridBody
            columnDefs={colDefs}
            list={result?.list ?? []}
            rowAction={rowAction}
            firstIdx={0}
          />
        </table>
        <div className="d-flex justify-content-center my-3">
          <Button onAction={() => setPageNum(pageNum + 1)}>Még {defaultPageSize}</Button>
        </div>
      </div>
    )
  }
}

///
