import * as functions from 'firebase-functions'
import algoliasearch from 'algoliasearch'

const FB_CONFIG = functions.config()
let client

export function getClient() {
  if (!client) {
    client = algoliasearch(FB_CONFIG.algolia.app_id, FB_CONFIG.algolia.api_key)
  }
  return client
}
