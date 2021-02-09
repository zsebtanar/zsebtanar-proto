import * as functions from 'firebase-functions'
import app from './api'

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB' as const,
}

/**
 * HTTP endpoints
 */
export const api = functions
  .region('us-central1')
  .runWith(runtimeOpts)
  .https.onRequest((request, response) => {
    console.info('request start')
    if (!request.path) {
      request.url = `/${request.url}` // prepend '/' to keep query params if any
    }
    return app(request, response)
  })
