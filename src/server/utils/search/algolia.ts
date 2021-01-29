import * as functions from 'firebase-functions'
import algoliasearch from 'algoliasearch'
import { SearchClient } from 'algoliasearch/dist/algoliasearch'

const FB_CONFIG = functions.config()
let client

export function getClient(): SearchClient {
  if (!client) {
    client = algoliasearch(FB_CONFIG.algolia.app_id, FB_CONFIG.algolia.api_key)
  }
  return client
}
