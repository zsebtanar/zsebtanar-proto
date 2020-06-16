import * as express from 'express'
import { ExerciseState, ExerciseModel } from 'shared/exercise/types'
import { getToken, requestValidator } from '../middlewares'
import { fireStore } from '../utils/firebase'
import { removeExerciseIndex, indexExercise } from './utils/search-indexing'
import { onlyAdmin } from '../utils/authorization'
import { ExerciseStateScheme, ExerciseStateSchemeType } from './model'
import { ErrorHandler } from '../middlewares/error'

export const route = express.Router()

route.post(
  '/:exerciseId/state',
  [getToken, onlyAdmin, requestValidator({ body: ExerciseStateScheme })],
  async (req, res, next) => {
    try {
      const id = req.params.exerciseId
      const newState = (req.body as ExerciseStateSchemeType).state as ExerciseState

      const exerciseRef = await fireStore
        .collection('exercise')
        .doc(id)
        .get()
      const exercise = exerciseRef.data() as ExerciseModel

      const currentState = exercise.state

      const method = selectUpdateMethod(newState, currentState)

      await method(exerciseRef.id, exercise)
      res.status(204).send()
    } catch (error) {
      next(new ErrorHandler(500, 'Exercise status change error', error))
    }
  }
)

const selectUpdateMethod = (
  newState: ExerciseState,
  oldState: ExerciseState
): ((id: string, exercise: ExerciseModel) => Promise<unknown>) => {
  if (
    (oldState === ExerciseState.Draft || oldState === ExerciseState.Archived) &&
    newState === ExerciseState.Public
  ) {
    return publishExercise
  }

  if (oldState === ExerciseState.Public && newState === ExerciseState.Archived) {
    return archiveExercise
  }

  if (newState === ExerciseState.Remove) {
    return removeExercise
  }

  throw new Error(`Invalid state transition: ${oldState} -> ${newState}`)
}

const publishExercise = async (id, exercise) => {
  await fireStore
    .collection('exercise')
    .doc(id)
    .update('state', ExerciseState.Public)
  await indexExercise(id, exercise)
}

const archiveExercise = async id => {
  await fireStore
    .collection('exercise')
    .doc(id)
    .update('state', ExerciseState.Archived)
  await removeExerciseIndex(id)
}

const removeExercise = async (id: string) => {
  await fireStore
    .collection('exercise')
    .doc(id)
    .delete()
  await removeExerciseIndex(id)
}
