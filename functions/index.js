import * as functions from 'firebase-functions'
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
