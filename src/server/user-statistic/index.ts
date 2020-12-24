import * as express from 'express'
import getToken from '../middlewares/firebaseToken'
import requestValidator from '../middlewares/requestValidator'
import { publicEndpoint } from '../utils/authorization'
import updateSolvedExercise from './updateSolvedExercise'
import { solvedExerciseUpdateSchema } from './schema'

export const route = express.Router()

// Add or update the existing statistics for the task

// TODO Add error handler to catch Joi validation issues
route.post(
  '/updateSolvedExercise/:uid/:exerciseId',
  [getToken, publicEndpoint, requestValidator({ body: solvedExerciseUpdateSchema })],
  updateSolvedExercise
)
