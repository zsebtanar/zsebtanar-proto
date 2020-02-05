
// FIXME: fix exercise search type
import * as algoliasearch from 'algoliasearch'

export type ExerciseSearchRecord = {
  grade: string[]
  subject: string[]
  topic: string[]
  tags: string[]
  difficulty: number
  description: string
  searchableDescription: string
  objectID: string
}

export type ExerciseSearchResult = algoliasearch.Response<ExerciseSearchRecord>

