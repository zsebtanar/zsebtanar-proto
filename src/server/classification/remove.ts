import * as express from 'express'
import firebase from 'firebase'
import { fireStore } from '../utils/firebase'
import { onlyAdmin } from '../utils/authorization'
import { ErrorHandler } from '../middlewares/error'
import { getToken } from '../middlewares/firebaseToken'
import { indexExercise } from '../exercise/utils/search-indexing'
import { ExerciseSchemaType } from '../exercise/model'
import { ClassificationModel } from '../../shared/classification/type'
import { ExerciseModel } from '../../shared/exercise/types'

export const route = express.Router()

route.delete('/:classificationId', [getToken, onlyAdmin], async (req, res, next) => {
  try {
    const batch = fireStore.batch()
    const searchUpdate: (() => Promise<unknown>)[] = []
    const classificationId = req.params.classificationId
    const classificationRef = fireStore.collection('classification').doc(classificationId)

    // get classification
    const classification = (await classificationRef.get()).data() as ClassificationModel

    // remove classification from exercises and update search
    await Promise.all(
      classification.exercises.map(async (exId) => {
        const exRef = fireStore.collection('exercise').doc(exId)
        const exercise = (await exRef.get()).data() as ExerciseModel
        if (exercise) {
          exercise.classifications = exercise.classifications.filter(
            (cls) => cls !== classificationId,
          )
          batch.update(exRef, {
            classifications: firebase.firestore.FieldValue.arrayUnion(classificationId),
          })
          searchUpdate.push(() => indexExercise(exId, exercise as ExerciseSchemaType))
        }
      }),
    )

    // remove classification
    batch.delete(classificationRef)

    // batch update
    await batch.commit()
    // update search after DB changed
    await Promise.all(searchUpdate.map((updateFn) => updateFn()))
  } catch (error) {
    console.log(error)
    next(new ErrorHandler(500, 'Classification remove error', error))
  }
})
