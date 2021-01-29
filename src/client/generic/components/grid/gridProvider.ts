import { useFetchData } from '../../hooks/fetchData'
import { GridDataSource } from 'shared/generic/types'
import { useState } from 'react'

export function useGridDS<T>(dataSource: GridDataSource<T>, pageNum: number, pageLimit: number) {
  const [list, setList] = useState<T[]>([])
  return useFetchData(
    async () => {
      const listExtension = await dataSource.getNextPage(pageLimit)
      const newList = [...list, ...listExtension]
      setList(newList)
      return {
        list: newList,
      }
    },
    [dataSource, pageNum, pageLimit],
    { isEmpty },
  )
}

const isEmpty = <T>({ list }: { list: T[] }): boolean => {
  return (list?.length ?? 0) === 0
}
