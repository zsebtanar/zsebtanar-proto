import { curry } from 'ramda'
import * as express from 'express'
import { onlyAdmin } from '../../utils/authorization'
import validateFirebaseIdToken from '../../middlewares/firebaseToken'
import preFetch from '../../middlewares/preFetchDB'
import { updateAllClassification } from '../crud/utils'
import * as model from '../model'
import * as search from '../crud/search'

export const STATE_KEY = '_state'
export const EXERCISE_DRAFT = 'draft'
export const EXERCISE_ACTIVE = 'active'
export const EXERCISE_ARCHIVE = 'archive'
export const EXERCISE_REMOVE = 'remove'

export const route = express.Router()

route.use(validateFirebaseIdToken)
route.use(preFetch('classifications/', 'exercise/private/:id'))

route.post(
  '/:exerciseId',
  onlyAdmin((req, res) => {
    const key = req.params.exerciseId
    const newState = req.body.state
    const cf = req.db.classifications
    const exercise = req.db.exercise.data

    return Promise.resolve(exercise[STATE_KEY])
      .then(selectUpdateMethod(newState))
      .then(fn => fn(key, cf, exercise))
      .then(() => res.status(204).send())
      .catch(error => {
        console.error(error)
        res.status(500).send('Unexpected error')
      })
  })
)

const selectUpdateMethod = curry((newState, oldState) => {
  if (
    (oldState === EXERCISE_DRAFT || oldState === EXERCISE_ARCHIVE) &&
    newState === EXERCISE_ACTIVE
  ) {
    return activateExercise
  }

  if (oldState === EXERCISE_ACTIVE && newState === EXERCISE_ARCHIVE) {
    return archiveExercise
  }

  if (oldState === EXERCISE_DRAFT && newState === EXERCISE_REMOVE) {
    return removeExercise
  }

  throw new Error(`Invalid state transition: ${oldState} -> ${newState}`)
})

const activateExercise = (key, cf, exercise) => {
  return Promise.all([
    model.savePrivateExercise(key, { [STATE_KEY]: EXERCISE_ACTIVE }),
    model.savePublicExercise(key, exercise),
    search.indexExercise(key, exercise, cf.data),
    cf.ref.update(updateAllClassification(cf.data, key, exercise))
  ])
}

const archiveExercise = (key, cf) => {
  return Promise.all([
    model.savePrivateExercise(key, { [STATE_KEY]: EXERCISE_ARCHIVE }),
    model.removePublicExercise(key),
    search.removeExerciseIndex(key),
    cf.ref.update(updateAllClassification(cf.data, key, {}))
  ])
}

// Remove
const removeExercise = (key, cf) => {
  return Promise.all([
    model.removeExercise(key),
    search.removeExerciseIndex(key),
    cf.ref.update(updateAllClassification(cf.data, key, {}))
  ])
}
