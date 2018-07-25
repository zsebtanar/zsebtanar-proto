import * as express from 'express'
import preFetch from '../../middlewares/preFetchDB'
import { onlyEditors } from '../../utils/authorization'
import { indexExercise } from './search'
import {
  exerciseSchema,
  getExerciseState,
  newPrivateExerciseKey,
  savePrivateExercise,
  savePublicExercise
} from '../model'
import { updateAllClassification } from './utils'
import { EXERCISE_ACTIVE, EXERCISE_DRAFT, STATE_KEY } from '../state/index'
import getToken from '../../middlewares/firebaseToken'
import requestValidator from '../../middlewares/requestValidator'

export const route = express.Router()

route.use(preFetch('classifications/'))

// create
route.post('/', [getToken, onlyEditors, requestValidator({ body: exerciseSchema })], (req, res) => {
  const key = newPrivateExerciseKey()
  const now = new Date()
  const cf = req.db.classifications

  const data = {
    ...req.body,
    _key: key,
    _created: now,
    _createdBy: req.user.uid,
    _updated: now,
    _updatedBy: req.user.uid,
    [STATE_KEY]: EXERCISE_DRAFT
  }

  Promise.all([indexExercise(key, data, cf.data), savePrivateExercise(key, data)])
    .then(() => res.status(201).json({ key }))
    .catch(error => {
      console.error(error)
      res.status(500).send('Unexpected error')
    })
})

// Update
route.post(
  '/:exerciseId',
  [getToken, onlyEditors, requestValidator({ body: exerciseSchema })],
  (req, res) => {
    const key = req.params.exerciseId
    const cf = req.db.classifications

    getExerciseState(key)
      .then(exerciseStateSS => {
        const exState = exerciseStateSS.val()

        const isActive = exState === EXERCISE_ACTIVE
        const data = {
          ...req.body,
          _key: key,
          _updated: new Date(),
          _updatedBy: req.user.uid
        }

        return Promise.all([
          savePrivateExercise(key, data),
          isActive ? savePublicExercise(key, data) : undefined,
          isActive ? indexExercise(key, data, cf.data) : undefined,
          isActive ? cf.ref.update(updateAllClassification(cf.data, key, data)) : undefined
        ])
      })
      .then(() => res.status(204).send())
      .catch(error => {
        console.error(error)
        res.status(500).send('Unexpected error')
      })
  }
)
