import algoli from 'algoliasearch/lite'
import { SearchResponse } from '@algolia/client-search'

const client = algoli(__CONFIG__.algolia.appId, __CONFIG__.algolia.key)
const index = client.initIndex('exercise-summary')

export function algoliaSearch(q: string): Readonly<Promise<SearchResponse>> {
  return index.search(q)
}
