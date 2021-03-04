import * as express from 'express'
import { fireStore } from '../utils/firebase'
import { onlyAdmin } from '../utils/authorization'
import { verifyUser } from '../middlewares/firebaseToken'
import { indexExercise, clearPublicExerciseIndexes } from '../exercise/utils/searchIndexing'
import { ExerciseDoc } from 'shared/exercise/types'
import { HandlerError } from '../utils/HandlerError'
import { ClassificationSummaryDoc } from '../../shared/classification/type'

export const route = express.Router()

route.get('/re-index-search', [verifyUser, onlyAdmin], async (req, res, next) => {
  try {
    const exercises = await fireStore.collection('exercise/private/items').get()

    const clsSummary = await fireStore.collection('classification').get()
    const allCls = clsSummary.docs.reduce((col, item) => {
      col[item.id] = item.data()
      return col
    }, {} as Record<string, ClassificationSummaryDoc>)

    await clearPublicExerciseIndexes()

    await Promise.all(
      exercises.docs.map(async (ex) => {
        const exData = ex.data()
        await indexExercise(ex.id, exData as ExerciseDoc, allCls[exData.lang])
      }),
    )

    res.status(204).send()
  } catch (error) {
    next(new HandlerError(500, 'Search re-indexing error', error))
  }
})
