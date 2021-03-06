import * as express from 'express'
import { ExerciseState, ExerciseDoc } from 'shared/exercise/types'
import { onlyEditors } from '../utils/authorization'
import { exerciseSchema } from './schemas'
import { fireStore } from '../utils/firebase'
import { verifyUser } from '../middlewares/firebaseToken'
import { validate } from '../utils/validator'
import { indexExercise } from './utils/searchIndexing'
import { incrementPrivateExerciseCounter } from './utils/counters'
import { HandlerError } from '../utils/HandlerError'
import { getClassifications } from './utils/classification'

export const route = express.Router()

route.post(
  '/',
  [verifyUser, onlyEditors, validate({ body: exerciseSchema })],
  async (req, res, next) => {
    try {
      // Timestamp
      const now = new Date()

      // Build exercise data
      const exercise: ExerciseDoc = {
        ...req.body,
        state: ExerciseState.Draft,
        created: now,
        createdBy: req.user.uid,
        updated: now,
        updatedBy: req.user.uid,
      }

      // Store private exercise
      const result = await fireStore.collection('exercise/private/items').add(exercise)

      const clsSummary = await getClassifications(exercise)

      // Update counter
      await incrementPrivateExerciseCounter(1)
      await indexExercise(result.id, exercise, clsSummary)

      // Response
      res.status(201).json({ ...exercise, id: result.id })
    } catch (error) {
      next(new HandlerError(500, 'Exercise create error', error))
    }
  },
)
