import { useFetchData } from '../../hooks/fetchData'

export function useGridDS<T>(dataSource: GridDataSource<T>, pageNum: number, pageLimit: number) {
  return useFetchData(
    async () => {
      const list = await dataSource.getPage(pageNum, pageLimit)
      return {
        list,
        numberOfPage: getNumOfPages(dataSource.size, pageLimit),
      }
    },
    [dataSource, pageNum, pageLimit],
    { isEmpty },
  )
}

const getNumOfPages = (size, pageSize: number): number => {
  return Math.ceil(size / pageSize)
}

const isEmpty = <T>({ list }: { list: T[] }): boolean => {
  return (list?.length ?? 0) === 0
}
