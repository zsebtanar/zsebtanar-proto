import * as functions from 'firebase-functions'
import app from './api'

/**
 * HTTP endpoints
 */

export const api = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}` // prepend '/' to keep query params if any
  }
  return app(request, response)
})
