import * as express from 'express'
import { getUser } from '../../middlewares/firebaseToken'
import { validate } from '../../utils/validator'
import { exerciseNextHintSchema } from '../schemas'
import { fireStore } from '../../utils/firebase'
import { ExerciseDoc } from '../../../shared/exercise/types'
import { HandlerError } from '../../utils/HandlerError'

export const route = express.Router()

route.post(
  '/:exerciseId/hint',
  [getUser, validate({ body: exerciseNextHintSchema })],
  async (req, res, next) => {
    try {
      const id = req.params.exerciseId
      const { subTask: subtaskIndex, hint } = req.body

      const itemRef = fireStore.collection(`exercise/private/items`).doc(id)
      const exercise = (await itemRef.get()).data() as ExerciseDoc

      const hints = exercise?.subTasks?.[subtaskIndex]?.hints ?? []
      const isFirstHint = hint === ''

      let nextHintIndex = -1
      if (isFirstHint) {
        nextHintIndex = 0
      } else {
        const currentHintIndex = hints.indexOf(hint)
        if (currentHintIndex > -1) {
          nextHintIndex = currentHintIndex + 1
        }
      }

      if (nextHintIndex !== -1 && nextHintIndex < hints.length) {
        res.status(200).json({
          hint: hints[nextHintIndex],
          hasMore: nextHintIndex + 1 < hints.length,
        })
      } else {
        res.status(400).json({ message: 'no hint' })
      }
    } catch (error) {
      next(new HandlerError(500, 'Exercise check error', error))
    }
  },
)
