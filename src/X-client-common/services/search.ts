import * as algoli from 'algoliasearch/lite'

const client = (algoli as any)(__CONFIG__.algolia.appId, __CONFIG__.algolia.key)
const index = client.initIndex('exercises')

export function search(q) {
  return index.search(q)
}
