import algoli from 'algoliasearch'

const APP_ID = 'UE3Y6VH327'
const SEARCH_KEY = '2a69c8b49d5f77f84eaa1b90c31add4d'

const client = algoli(APP_ID, SEARCH_KEY)
const index = client.initIndex('exercises')

export function search(q) {
  return index.search(q)
}
