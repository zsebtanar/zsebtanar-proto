import * as express from 'express'
import { fireStore } from '../utils/firebase'
import { ExerciseDoc } from '../../shared/exercise/types'
import { HandlerError } from '../utils/HandlerError'

export const route = express.Router()

route.get('/:exerciseId', [], async (req, res, next) => {
  try {
    const id = req.params.exerciseId

    const itemRef = fireStore.collection(`exercise/private/item`).doc(id)
    const exercise = (await itemRef.get()).data() as ExerciseDoc

    const { title, classifications, difficulty, description, published, subTasks } = exercise

    // Remove all private data
    const publicExercise = {
      title,
      classifications,
      difficulty,
      description,
      published,
      subTasks: subTasks.map(({ controls, description }) => ({
        description,
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
