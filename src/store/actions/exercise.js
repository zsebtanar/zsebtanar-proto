import {createExercise, getAllPrivateExercises, getPrivateExercise, checkSolution} from '../services/exercise'

export const EXERCISE_GET_ALL = 'EXERCISE_GET_ALL'
export const EXERCISE_GET = 'EXERCISE_GET'
export const EXERCISE_CREATED = 'EXERCISE_CREATED'
export const EXERCISE_CHECK_SUCCESS = 'EXERCISE_CHECK_SUCCESS'
export const EXERCISE_CHECK_FAIL = 'EXERCISE_CHECK_FAIL'
export const EXERCISE_CHECK_ERROR = 'EXERCISE_CHECK_ERROR'


export function getAllExerciseAction() {
   return dispatch => getAllPrivateExercises()
     .then( payload => dispatch({ type: EXERCISE_GET_ALL, payload }))
}


export function getExerciseAction(key) {
  return dispatch => getPrivateExercise(key)
    .then( payload => dispatch({ type: EXERCISE_GET, payload }))
}

export function createExerciseAction(data) {
  console.log(data);
  return dispatch => createExercise(data)
    .then(() =>dispatch({ type: EXERCISE_CREATED }))
}

export function checkSolutionAction(key, solution) {
  return dispatch => checkSolution(key, solution)
      .then(({data}) =>
        dispatch({
          type: data.valid ? EXERCISE_CHECK_SUCCESS : EXERCISE_CHECK_FAIL
        })
      )
      .catch((error) => dispatch({type: EXERCISE_CHECK_ERROR, payload: error}))
}