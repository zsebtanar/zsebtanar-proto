import * as express from 'express'
import { fireStore } from '../utils/firebase'
import { ExerciseDoc, PublicExercise } from '../../shared/exercise/types'
import { HandlerError } from '../utils/HandlerError'

export const route = express.Router()

route.get('/:exerciseId', [], async (req, res, next) => {
  try {
    const exerciseId = req.params.exerciseId

    const itemRef = fireStore.collection(`exercise/private/items`).doc(exerciseId)
    const exercise = (await itemRef.get()).data() as ExerciseDoc

    const {
      title,
      classifications,
      difficulty,
      description,
      published,
      subTasks,
      script,
    } = exercise

    // Remove all private data
    const publicExercise: PublicExercise = {
      id: exerciseId,
      title,
      classifications,
      difficulty,
      description,
      published,
      script,
      subTasks: subTasks.map(({ controls, description, hints }) => ({
        description,
        hasHints: hints?.length > 0,
        controls: controls.map(({ name, type, props, isDynamic }) => ({
          name,
          type,
          props,
          isDynamic,
        })),
      })),
    }

    // Response
    res.status(200).send(publicExercise)
  } catch (error) {
    next(new HandlerError(500, 'Exercise request error', error))
  }
})
