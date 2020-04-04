import * as express from 'express'
import getToken from '../middlewares/firebaseToken'
import requestValidator from '../middlewares/requestValidator'
import { onlyUser } from '../utils/authorization'
import updateSolvedTask from './updateSolvedTask'
import { solvedTaskUpdateSchema } from './schema'

export const route = express.Router()

// Add or update the existing statistics for the task
route.post(
  '/updateSolvedTask/:uid/:taskId',
  [getToken, onlyUser, requestValidator({ body: solvedTaskUpdateSchema })],
  updateSolvedTask
)
