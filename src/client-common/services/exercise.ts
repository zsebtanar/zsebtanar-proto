import { isNil, not, path, pipe, values } from 'ramda'
import { cloudFnGet, cloudFnPost, resolveSnapshot } from '../util/firebase'
import { assertP, excludeMetaKeys } from '../../shared/util/fn'
import { app } from '../fireApp'
import { NotFoundError } from '../util/error'

const DB = app.database()
const Exercises = DB.ref('exercise')

export const STATE_KEY = '_state'
export const EXERCISE_DRAFT = 'draft'
export const EXERCISE_ACTIVE = 'active'
export const EXERCISE_ARCHIVE = 'archive'
export const EXERCISE_REMOVE = 'remove'

const notFound = uid =>
  assertP(
    pipe(
      isNil,
      not
    ),
    new NotFoundError(`A kért feladat nem létezik: "${uid}".`)
  )

export function getPublicExercise(exerciseId): Promise<DB.Exercise> {
  return Exercises.child(`public/${exerciseId}`)
    .once('value')
    .then(
      pipe(
        resolveSnapshot,
        notFound(exerciseId)
      )
    )
}

export function getPrivateExercise(exerciseId) {
  return Exercises.child(`private/${exerciseId}`)
    .once('value')
    .then(
      pipe(
        resolveSnapshot,
        notFound(exerciseId)
      )
    )
}

export function getAllPrivateExercises(): Promise<any> {
  return Exercises.child('private')
    .once('value')
    .then(
      pipe(
        resolveSnapshot,
        values
      )
    )
}

export function selectPublicExercisesById(exerciseIds: string[]): Promise<DB.Exercise[]> {
  return Promise.all(exerciseIds.map(getPublicExercise))
}

export const createExercise = data =>
  cloudFnPost(`exercise`, excludeMetaKeys(data), { withToken: true }).then(path(['data', 'key']))

export const updateExercise = (exerciseId, data) =>
  cloudFnPost(`exercise/${exerciseId}`, excludeMetaKeys(data), { withToken: true })

export const checkSolution = (exerciseId, subTaskId, solutions) =>
  cloudFnPost('exercise/check', { key: exerciseId, task: subTaskId, solutions })

export const getHint = (exerciseId, subTaskId, lastHintId) =>
  cloudFnGet('exercise/getNextHint', { key: exerciseId, task: subTaskId, hint: lastHintId })

export const changeState = (exerciseId, state) =>
  cloudFnPost(`exercise/state/${exerciseId}`, { state }, { withToken: true })
