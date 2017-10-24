import * as functions from 'firebase-functions'
// import createThumbnail from './src/storage/createThumbnail'
import app from './src/api'

/**
 * HTTP endpoints
 */

exports.api = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}` // prepend '/' to keep query params if any
  }
  return app(request, response)
})

/**
 * Storage functions
 */
// exports.generateThumbnail = functions.storage.object().onChange(createThumbnail)
