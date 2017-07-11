import {
  createExercise, getAllPrivateExercises, getPrivateExercise, checkSolution,
  updateExercise, removeExercise, getHint, getPublicExercise
} from '../services/exercise'
import {all, identity} from 'ramda'

export const EXERCISE_GET_ALL = 'EXERCISE_GET_ALL'
export const EXERCISE_GET = 'EXERCISE_GET'
export const EXERCISE_CREATED = 'EXERCISE_CREATED'
export const EXERCISE_CHECK_SUCCESS = 'EXERCISE_CHECK_SUCCESS'
export const EXERCISE_CHECK_FAIL = 'EXERCISE_CHECK_FAIL'
export const EXERCISE_CHECK_ERROR = 'EXERCISE_CHECK_ERROR'
export const EXERCISE_UPDATED = 'EXERCISE_UPDATED'
export const EXERCISE_REMOVED = 'EXERCISE_REMOVED'

export const HINT_GET = 'HINT_GET'
export const HINT_GET_ERROR = 'HINT_GET_ERROR'

export function getAllExerciseAction() {
   return dispatch => getAllPrivateExercises()
     .then( payload => dispatch({ type: EXERCISE_GET_ALL, payload }))
}


export function getExerciseAction(key) {
  return dispatch => getPrivateExercise(key)
    .then( payload => dispatch({ type: EXERCISE_GET, payload }))
}

export function getPublicExerciseAction(key) {
  return dispatch => getPublicExercise(key)
    .then( payload => dispatch({ type: EXERCISE_GET, payload }))
}

export function createExerciseAction(data) {
  return dispatch => createExercise(data)
    .then(() =>dispatch({ type: EXERCISE_CREATED }))
}

export function updateExerciseAction(key, data) {
  return dispatch => updateExercise(key, data)
    .then(() =>dispatch({ type: EXERCISE_UPDATED }))
}

export function removeExerciseAction(key) {
  return dispatch => removeExercise(key)
    .then(() =>dispatch({ type: EXERCISE_REMOVED }))
}

export function checkSolutionAction(key, solutions) {
  return dispatch => checkSolution(key, solutions)
      .then(({data}) =>
        dispatch({
          type: all(identity, data.valid) ? EXERCISE_CHECK_SUCCESS : EXERCISE_CHECK_FAIL,
          payload: data
        })
      )
      .catch((error) => dispatch({type: EXERCISE_CHECK_ERROR, payload: error}))
}

export function getHintAction(key, lastHintKey) {
  return dispatch => getHint(key, lastHintKey)
      .then(({data}) =>
        dispatch({
          type: HINT_GET,
          payload: data
        })
      )
      .catch((error) => dispatch({type: HINT_GET_ERROR, payload: error}))
}