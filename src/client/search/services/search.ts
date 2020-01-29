import algoli from 'algoliasearch/lite'

const client = algoli(__CONFIG__.algolia.appId, __CONFIG__.algolia.key)
const index = client.initIndex('exercises')

export function search(q: string) {
  return index.search(q)
}
