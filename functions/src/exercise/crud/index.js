import { pick } from 'ramda'
import * as express from 'express'
import validateFirebaseIdToken from '../../middlewares/firebaseToken'
import preFetch from '../../middlewares/preFetchDB'
import { onlyEditors } from '../../utils/authorization'
import { indexExercise } from './search'
import { newPrivateExerciseKey, savePrivateExercise, savePublicExercise } from '../model'
import { updateAllClassification } from './utils'
import { EXERCISE_ACTIVE, EXERCISE_DRAFT, STATE_KEY } from '../state'

const VALID_KEYS = [
  'classification',
  'controls',
  'description',
  'solutions',
  'title',
  'hints',
  'difficulty'
]

const route = express.Router()
export default route

route.use(validateFirebaseIdToken)
route.use(preFetch('classifications/'))

// create
route.post(
  '/',
  onlyEditors((req, res) => {
    const key = newPrivateExerciseKey()
    const now = new Date()
    const cf = req.db.classifications

    const data = {
      ...pick(VALID_KEYS, req.body),
      _key: key,
      _created: now,
      _createdBy: req.user.uid,
      _updated: now,
      _updatedBy: req.user.uid,
      [STATE_KEY]: EXERCISE_DRAFT
    }

    return Promise.all([indexExercise(key, data, cf.data), savePrivateExercise(key, data)])
      .then(() => res.status(201).send())
      .catch(error => {
        console.error(error)
        res.status(500).send('Unexpected error')
      })
  })
)

// Update
route.post(
  '/:exerciseId',
  onlyEditors((req, res) => {
    const key = req.params.exerciseId
    const isActive = req.body.state === EXERCISE_ACTIVE
    const cf = req.db.classifications

    const data = {
      ...pick(VALID_KEYS, req.body),
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
      .then(() => res.status(204).send())
      .catch(error => {
        console.error(error)
        res.status(500).send('Unexpected error')
      })
  })
)
