import * as express from 'express'
import { fireStore } from '../utils/firebase'
import { onlyAdmin } from '../utils/authorization'
import { verifyUser } from '../middlewares/firebaseToken'
import { ExerciseDoc, ExerciseState, ExerciseSummaryDoc } from 'shared/exercise/types'
import { HandlerError } from '../utils/HandlerError'
import { getClassifications } from '../exercise/utils/classification'
import { storeExerciseSummary } from '../exercise/utils/exerciseSummary'
import { indexExercise, removeExerciseIndex } from '../exercise/utils/searchIndexing'
import { removeExerciseFromClassifications } from '../classification/utils'

export const route = express.Router()

route.get('/sync-exercises', [verifyUser, onlyAdmin], async (req, res, next) => {
  try {
    const exercises = await fireStore.collection('exercise/private/items').get()
    const summaries = await fireStore.collection('exercise/summary/items').get()

    // fixme: extend to other languages as well
    const clsSummary = await getClassifications(exercises.docs[0].data() as ExerciseDoc)

    const batch = fireStore.batch()

    await Promise.all(
      exercises.docs.map(async (ex) => {
        const exData = ex.data() as ExerciseDoc
        if (exData.state === ExerciseState.Public && !summaries.docs.find((d) => d.id === ex.id)) {
          // add exercise summaries if they published but not created yet
          await storeExerciseSummary(ex.id, exData)
          await indexExercise(ex.id, exData, clsSummary)
        }
        if (exData.state !== ExerciseState.Public && summaries.docs.find((d) => d.id === ex.id)) {
          // remove not published exercise summaries
          await removeExerciseFromClassifications(batch, ex.id, exData.classifications)
          await removeExerciseIndex(ex.id, 'summary')
        }
      }),
    )

    // Remove all summary which do not have privet counterpart
    await Promise.all(
      summaries.docs.map(async (sum) => {
        if (!exercises.docs.find((d) => d.id === sum.id)) {
          const sumData = sum.data() as ExerciseSummaryDoc
          await removeExerciseFromClassifications(batch, sum.id, sumData.classifications)
          await removeExerciseIndex(sum.id, 'summary')
        }
      }),
    )

    await batch.commit()

    res.status(204).send()
  } catch (error) {
    next(new HandlerError(500, 'Search re-indexing error', error))
  }
})
