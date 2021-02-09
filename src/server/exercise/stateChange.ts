import * as express from 'express'
import { ExerciseDoc, ExerciseModel, ExerciseState } from 'shared/exercise/types'
import { fireStore } from '../utils/firebase'
import { indexExercise, removeExerciseIndex } from './utils/searchIndexing'
import { onlyAdmin } from '../utils/authorization'
import { changeExerciseStateSchema } from './schemas'
import { getToken } from '../middlewares/firebaseToken'
import { removeExerciseFromClassifications } from '../classification/utils'
import { incrementPrivateExerciseCounter } from './utils/counters'
import { storeExerciseSummary } from './utils/exerciseSummary'
import { validate } from '../utils/validator'
import { HandlerError } from '../utils/HandlerError'
import { getClassifications } from './utils/classification'

export const route = express.Router()

route.post(
  '/:exerciseId/state',
  [getToken, onlyAdmin, validate({ body: changeExerciseStateSchema })],
  async (req, res, next) => {
    try {
      const id = req.params.exerciseId
      const newState = req.body.state as ExerciseState

      const exerciseRef = await fireStore.collection('exercise/private/items').doc(id).get()
      const exercise = exerciseRef.data() as ExerciseModel

      const currentState = exercise.state

      const method = selectUpdateMethod(newState, currentState)

      await method(exerciseRef.id, exercise)
      res.status(204).send()
    } catch (error) {
      next(new HandlerError(500, 'Exercise status change error', error))
    }
  },
)

const selectUpdateMethod = (
  newState: ExerciseState,
  oldState: ExerciseState,
): ((id: string, exercise: ExerciseDoc) => Promise<unknown>) => {
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
  await fireStore.collection('exercise/private/items').doc(id).update('state', ExerciseState.Public)

  const clsSummary = await getClassifications(exercise)

  await storeExerciseSummary(id, exercise)
  await indexExercise(id, exercise, clsSummary)
}

const archiveExercise = async (id, exercise: ExerciseDoc) => {
  const batch = fireStore.batch()

  const exerciseRef = fireStore.collection('exercise/private/items').doc(id)
  const summaryRef = fireStore.collection('exercise/summary/items').doc(id)

  batch.delete(summaryRef)
  batch.update(exerciseRef, 'state', ExerciseState.Archived)

  await removeExerciseFromClassifications(batch, id, exercise.classifications)

  await batch.commit()
  await removeExerciseIndex(id, 'summary')
}

const removeExercise = async (id: string) => {
  await fireStore.collection('exercise/private/items').doc(id).delete()
  await incrementPrivateExerciseCounter(-1)
  await removeExerciseIndex(id, 'admin')
}
