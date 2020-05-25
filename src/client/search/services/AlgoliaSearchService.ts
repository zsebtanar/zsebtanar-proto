import * as algoliasearch from 'algoliasearch'
import { useFetchData } from 'client/generic/hooks'
import { algoliaSearch } from './search'
import { ExerciseSearchResult } from 'client/search/types'
import { useCallback } from 'react'

export function useAlgoliaSearch(searchTerm: string, limit = 2) {
  const callback = useCallback(() => {
    if (searchTerm.length < limit) {
      return Promise.resolve({}) as Promise<ExerciseSearchResult>
    } else {
      return algoliaSearch(searchTerm)
    }
  }, [searchTerm])

  const isEmpty = useCallback((data: algoliasearch.Response): boolean => {
    return (data?.nbHits ?? 0) === 0
  }, [])

  return useFetchData<ExerciseSearchResult>(callback, [searchTerm], {
    isEmpty
  })
}
