import { always, filter, isNil, not, path, pipe, values } from 'ramda'
import { assertP, excludeMetaKeys, isNotNil } from '../../shared/util/fn'
import { app } from 'client/generic/services/fireApp'
import { NotFoundError } from '../../client/generic/utils/error'
import { cloudFnGet, cloudFnPost, resolveSnapshot } from 'client/generic/services/firebase'

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

/**
 * Request Exercise by Ids and ignore missing or not published items
 *
 * @param exerciseIds
 */
export function selectPublicExercisesById(exerciseIds: string[]): Promise<DB.Exercise[]> {
  const getWithoutError = id => getPublicExercise(id).catch(always(undefined))
  return Promise.all(exerciseIds.map(getWithoutError)).then(list => filter(isNotNil, list))
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
