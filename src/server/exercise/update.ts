import * as express from 'express'
import { onlyEditors } from '../utils/authorization'
import { exerciseSchema } from './schemas'
import { fireStore } from '../utils/firebase'
import { omit } from 'shared/utils/fn'
import { getToken } from '../middlewares/firebaseToken'
import { indexExercise } from './utils/searchIndexing'
import { difference } from '../../shared/utils/data'
import { ExerciseDoc } from '../../shared/exercise/types'
import {
  addExerciseToClassifications,
  removeExerciseFromClassifications,
} from '../classification/utils'
import { storeExerciseSummary } from './utils/exerciseSummary'
import { validate } from '../utils/validator'
import { HandlerError } from '../utils/HandlerError'
import { getClassifications } from './utils/classification'

export const route = express.Router()

route.post(
  '/:exerciseId',
  [getToken, onlyEditors, validate({ body: exerciseSchema })],
  async (req, res, next) => {
    try {
      const now = new Date()
      const id = req.params.exerciseId
      const batch = fireStore.batch()

      // exercise
      const exercise: ExerciseDoc = {
        ...(omit(req.body, ['state', 'created', 'createdBy']) as ExerciseDoc),
        updated: now,
        updatedBy: req.user.uid,
      }
      const exerciseRef = fireStore.collection('exercise/private/items').doc(id)
      const previousExercise = (await exerciseRef.get()).data() as ExerciseDoc

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

      const clsSummary = await getClassifications(exercise)

      await batch.commit()
      await storeExerciseSummary(id, exercise)
      await indexExercise(id, exercise as ExerciseDoc, clsSummary)
      res.status(200).send(exercise)
    } catch (error) {
      next(new HandlerError(500, 'Exercise update error', error))
    }
  },
)
