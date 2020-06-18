import * as express from 'express'
import { onlyEditors } from '../utils/authorization'
import { getToken, requestValidator } from '../middlewares'
import { ExerciseSchema, ExerciseSchemaType } from './model'
import { fireStore } from '../utils/firebase'
import { omit } from 'shared/utils/fn'
import { ErrorHandler } from '../middlewares/error'

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
        ...omit(req.body as ExerciseSchemaType, ['state'])
      }
      const exRef = fireStore.collection('exercise').doc(id)
      batch.update(exRef, exercise)

      // metadata - log
      const logRef = fireStore.collection(`exercise/${id}/metadata`).doc('log')
      batch.update(logRef, {
        updated: now,
        updatedBy: req.user.uid,
        lastUpdate: now
      })
      // FIXME add resources

      await batch.commit()
      res.status(200).send(exercise)
    } catch (error) {
      next(new ErrorHandler(500, 'Exercise update error', error))
    }
  }
)
