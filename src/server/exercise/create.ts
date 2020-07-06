import * as express from 'express'
import { ExerciseState } from 'shared/exercise/types'
import { onlyEditors } from '../utils/authorization'
import { ExerciseSchema, ExerciseSchemaType, ExerciseStateSchemeType } from './model'
import { fireStore } from '../utils/firebase'
import { indexExercise } from './utils/search-indexing'
import { ErrorHandler } from '../middlewares/error'
import { getToken } from '../middlewares/firebaseToken'
import { requestValidator } from '../middlewares/requestValidator'

export const route = express.Router()

route.post(
  '/',
  [getToken, onlyEditors, requestValidator({ body: ExerciseSchema })],
  async (req, res, next) => {
    try {
      const now = new Date()
      // exercise
      const exercise: ExerciseStateSchemeType = {
        ...(req.body as ExerciseSchemaType),
        state: ExerciseState.Draft,
      }
      const result = await fireStore.collection('exercise').add(exercise)

      // metadata - log
      const metadataLog = {
        created: now,
        createdBy: req.user.uid,
        updated: now,
        updatedBy: req.user.uid,
      }
      await fireStore.collection(`exercise/${result.id}/metadata`).doc('log').set(metadataLog)

      // search
      await indexExercise(result.id, exercise as ExerciseSchemaType)

      res.status(201).json({ ...exercise, id: result.id })
    } catch (error) {
      next(new ErrorHandler(500, 'Exercise create error', error))
    }
  },
)
