import * as express from 'express'
import { onlyEditors } from '../utils/authorization'
import { ExerciseSchema, ExerciseSchemaType } from './model'
import { fireStore } from '../utils/firebase'
import { omit } from 'shared/utils/fn'
import { ErrorHandler } from '../middlewares/error'
import { getToken } from '../middlewares/firebaseToken'
import { requestValidator } from '../middlewares/requestValidator'
import { indexExercise } from './utils/search-indexing'
import { difference } from '../../shared/utils/data'
import { ExerciseModel } from '../../shared/exercise/types'
import {
  addExerciseToClassifications,
  removeExerciseFromClassifications,
} from '../classification/utils'

export const route = express.Router()

route.post(
  '/:exerciseId',
  [getToken, onlyEditors, requestValidator({ body: ExerciseSchema })],
  async (req, res, next) => {
    try {
      const now = new Date()
      const id = req.params.exerciseId
      const batch = fireStore.batch()

      // exercise
      const exercise = {
        ...omit(req.body as ExerciseSchemaType, ['state', 'created']),
      }
      const exerciseRef = fireStore.collection('exercise').doc(id)
      const previousExercise = (await exerciseRef.get()).data() as ExerciseModel

      batch.update(exerciseRef, exercise)

      if (previousExercise) {
        const removedClassifications = difference(
          previousExercise.classifications,
          exercise.classifications,
        )
        await removeExerciseFromClassifications(batch, id, removedClassifications)

        const addedClassifications = difference(
          exercise.classifications,
          previousExercise.classifications,
        )
        await addExerciseToClassifications(batch, id, addedClassifications)
      }

      // metadata - log
      const logRef = fireStore.collection(`exercise/${id}/metadata`).doc('log')
      batch.update(logRef, {
        updated: now,
        updatedBy: req.user.uid,
        lastUpdate: now,
      })

      await batch.commit()
      await indexExercise(id, exercise as ExerciseSchemaType)
      res.status(200).send(exercise)
    } catch (error) {
      next(new ErrorHandler(500, 'Exercise update error', error))
    }
  },
)
