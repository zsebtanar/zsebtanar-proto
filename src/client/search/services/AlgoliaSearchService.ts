import { useCallback } from 'react'
import { SearchResponse } from '@algolia/client-search'
import { useFetchData } from 'client/generic/hooks'
import { algoliaSearch } from './search'
import { ExerciseSearchResult } from 'client/search/types'

export function useAlgoliaSearch(searchTerm: string, limit = 2) {
  const callback = useCallback(() => {
    if (searchTerm.length < limit) {
      return Promise.resolve({}) as Promise<ExerciseSearchResult>
    } else {
      return algoliaSearch(searchTerm) as Promise<ExerciseSearchResult>
    }
  }, [searchTerm])

  const isEmpty = useCallback((data: ExerciseSearchResult): boolean => {
    return (data?.nbHits ?? 0) === 0
  }, [])

  return useFetchData<ExerciseSearchResult>(callback, [searchTerm], {
    isEmpty,
  })
}
