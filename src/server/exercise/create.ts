import * as express from 'express'
import { ExerciseModel, ExerciseState } from 'shared/exercise/types'
import { getToken, requestValidator } from '../middlewares'
import { onlyEditors } from '../utils/authorization'
import { ExerciseSchema, ExerciseSchemaType } from './model'
import { fireStore } from '../utils/firebase'
import { indexExercise } from './utils/search-indexing'

export const route = express.Router()

route.post(
  '/',
  [getToken, onlyEditors, requestValidator({ body: ExerciseSchema })],
  async (req, res) => {
    try {
      const now = new Date()
      // exercise
      const exercise: ExerciseModel = {
        ...(req.body as ExerciseSchemaType),
        state: ExerciseState.Draft
      }
      const result = await fireStore.collection('exercise').add(exercise)

      // metadata - log
      const metadataLog = {
        created: now,
        createdBy: req.user.uid,
        updated: now,
        updatedBy: req.user.uid
      }
      await fireStore
        .collection(`exercise/${result.id}/metadata`)
        .doc('log')
        .set(metadataLog)

      // search
      await indexExercise(result.id, exercise)

      res.status(201).json({ ...exercise, id: result.id })
    } catch (error) {
      console.error('Create exercise error:', error)
      res.status(500).send('Unexpected error')
    }
  }
)
