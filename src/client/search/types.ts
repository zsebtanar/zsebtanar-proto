// FIXME: fix exercise search type
import { SearchResponse } from '@algolia/client-search'

export type ExerciseSearchRecord = {
  classifications: string[]
  classificationLabels: string[]
  difficulty: number
  description: string
  searchableDescription: string
  objectID: string
}

export type ExerciseSearchResult = SearchResponse<ExerciseSearchRecord>
