import * as express from 'express'
import { getUser } from '../../middlewares/firebaseToken'
import { validate } from '../../utils/validator'
import { exerciseCheckSchema } from '../schemas'
import { fireStore } from '../../utils/firebase'
import { ExerciseDoc } from '../../../shared/exercise/types'
import { HandlerError } from '../../utils/HandlerError'
import { validateUserControl } from './validateUserControl'

export const route = express.Router()

route.post(
  '/:exerciseId/check',
  [getUser, validate({ body: exerciseCheckSchema })],
  async (req, res, next) => {
    try {
      const id = req.params.exerciseId
      const { seed, subTask: subtaskIndex, answers } = req.body

      const itemRef = fireStore.collection(`exercise/private/items`).doc(id)
      const exercise = (await itemRef.get()).data() as ExerciseDoc

      const result = validateUserControl(exercise, seed, subtaskIndex, answers)

      if (result) {
        res.status(204).send()
      } else {
        res.status(400).send()
      }
    } catch (error) {
      next(new HandlerError(500, 'Exercise check error', error))
    }
  },
)
