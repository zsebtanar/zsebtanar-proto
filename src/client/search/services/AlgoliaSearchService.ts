import * as algoliasearch from 'algoliasearch'
import { useFetchData } from 'client/generic/hooks'
import { algoliaSearch } from './search'
import { ExerciseSearchResult } from 'client/search/types'

export function useAlgoliaSearch(searchTerm: string, limit = 2) {
  return useFetchData<ExerciseSearchResult>(
    () => {
      if (searchTerm.length < limit) {
        return Promise.resolve({}) as Promise<ExerciseSearchResult>
      } else {
        return algoliaSearch(searchTerm)
      }
    },
    [searchTerm],
    {
      isEmpty(data: algoliasearch.Response): boolean {
        return (data?.nbHits ?? 0) === 0
      }
    }
  )
}
