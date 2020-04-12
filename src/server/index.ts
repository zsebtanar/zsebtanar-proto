import * as functions from 'firebase-functions'
import app from './api'
import { userSolvedAnExercise } from './trigger/userSolvedAnExercise'

/**
 * HTTP endpoints
 */

export const api = functions.https.onRequest((request: any, response: any) => {
  if (!request.path) {
    request.url = `/${request.url}` // prepend '/' to keep query params if any
  }
  return app(request, response)
})


/**
 * Real time db triggers
 */

export const checkUserStatistics = functions.database.ref('/userStatistics/{userUId}/solvedExercises/{exerciseId}')
  .onWrite((snapshot, context) => userSolvedAnExercise(snapshot, context))