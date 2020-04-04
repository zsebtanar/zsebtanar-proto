import * as express from 'express'
import getToken from '../middlewares/firebaseToken'
import requestValidator from '../middlewares/requestValidator'
import { onlyUser } from '../utils/authorization'
import updateSolvedExercise from './updateSolvedExercise'
import { solvedExerciseUpdateSchema } from './schema'

export const route = express.Router()

// Add or update the existing statistics for the task
route.post(
  '/updateExerciseTask/:uid/:exerciseId',
  [getToken, onlyUser, requestValidator({ body: solvedExerciseUpdateSchema })],
  updateSolvedExercise
)
