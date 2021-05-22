import * as express from 'express'
import firebase from 'firebase'
import { fireStore } from '../utils/firebase'
import { onlyAdmin } from '../utils/authorization'
import { verifyUser } from '../middlewares/firebaseToken'
import { indexExercise } from '../exercise/utils/searchIndexing'
import {
  ClassificationSummaryDoc,
  ClassificationDetailsDoc,
} from '../../shared/classification/type'
import { ExerciseModel, ExerciseDoc } from '../../shared/exercise/types'
import { getClassificationLang } from './utils'
import { HandlerError } from '../utils/HandlerError'

export const route = express.Router()

route.delete('/:classificationId', [verifyUser, onlyAdmin], async (req, res, next) => {
  try {
    const batch = fireStore.batch()
    const searchUpdate: (() => Promise<unknown>)[] = []
    const clsId = req.params.classificationId
    const lang = getClassificationLang(clsId)
    const clsSummaryRef = fireStore.collection('classification').doc(lang)
    const clsDetailsRef = fireStore.collection(`classification/${lang}/details`).doc(clsId)

    // Request classification data
    const clsSummary = (await clsSummaryRef.get()).data() as ClassificationSummaryDoc
    const clsDetails = (await clsDetailsRef.get()).data() as ClassificationDetailsDoc

    // Remove classification from exercises and update search
    await Promise.all(
      clsDetails.exercises.map(async (exId) => {
        const exRef = fireStore.collection('exercise').doc(exId)
        const exercise = (await exRef.get()).data() as ExerciseModel
        if (exercise) {
          exercise.classifications = exercise.classifications.filter((cls) => cls !== clsId)
          batch.update(exRef, {
            classifications: firebase.firestore.FieldValue.arrayUnion(clsId),
          })
          searchUpdate.push(() => indexExercise(exId, exercise as ExerciseDoc, clsSummary))
        }
      }),
    )

    // Remove classification from summary
    batch.set(clsSummaryRef, { clsSummary, [clsId]: undefined })

    // Remove classification details
    batch.delete(clsDetailsRef)

    // Remove classification
    batch.delete(clsSummaryRef)

    // Batch update
    await batch.commit()

    // Update search indexes after DB changed
    await Promise.all(searchUpdate.map((updateFn) => updateFn()))
  } catch (error) {
    next(new HandlerError(500, 'Classification remove error', error))
  }
})
