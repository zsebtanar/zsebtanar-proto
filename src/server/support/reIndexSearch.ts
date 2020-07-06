import * as express from 'express'
import { fireStore } from '../utils/firebase'
import { onlyAdmin } from '../utils/authorization'
import { ErrorHandler } from '../middlewares/error'
import { getToken } from '../middlewares/firebaseToken'
import { indexExercise, clearExerciseIndexes } from '../exercise/utils/search-indexing'
import { ExerciseSchemaType } from '../exercise/model'

export const route = express.Router()

route.get('/re-index-search', [getToken, onlyAdmin], async (req, res, next) => {
  try {
    const res = await fireStore.collection('exercise').get()
    const exercises = res.docs.map((d) => d.data())

    await clearExerciseIndexes()

    await Promise.all(exercises.map((ex) => indexExercise(ex.id, ex as ExerciseSchemaType)))
  } catch (error) {
    console.log(error)
    next(new ErrorHandler(500, 'Search re-indexing error', error))
  }
})
