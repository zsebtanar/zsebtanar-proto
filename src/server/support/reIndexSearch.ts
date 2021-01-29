import * as express from 'express'
import { fireStore } from '../utils/firebase'
import { onlyAdmin } from '../utils/authorization'
import { getToken } from '../middlewares/firebaseToken'
import { indexExercise, clearPublicExerciseIndexes } from '../exercise/utils/searchIndexing'
import { ExerciseDoc } from 'shared/exercise/types'
import { HandlerError } from '../utils/HandlerError'

export const route = express.Router()

route.get('/re-index-search', [getToken, onlyAdmin], async (req, res, next) => {
  try {
    const res = await fireStore.collection('exercise').get()
    const exercises = res.docs.map((d) => d.data())

    await clearPublicExerciseIndexes()

    await Promise.all(exercises.map((ex) => indexExercise(ex.id, ex as ExerciseDoc)))
  } catch (error) {
    next(new HandlerError(500, 'Search re-indexing error', error))
  }
})
