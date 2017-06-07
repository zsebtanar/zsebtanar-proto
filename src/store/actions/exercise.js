import {values} from 'ramda'
import axios from 'axios'

const DB = window.firebase.database()

export const FETCH_ALL_EXERCISE = 'FETCH_ALL_EXERCISE'
export const FETCH_EXERCISE = 'FETCH_EXERCISE'
export const CREATE_EXERCISE = 'CREATE_EXERCISE'
export const EXERCISE_CHECK_SUCCESS = 'EXERCISE_CHECK_SUCCESS'
export const EXERCISE_CHECK_FAIL = 'EXERCISE_CHECK_FAIL'
export const EXERCISE_CHECK_ERROR = 'EXERCISE_CHECK_ERROR'


const Exercises = DB.ref('exercise')


export function fetchAllExercise() {
  return dispatch => Exercises
    .on('value', snapshot =>
      dispatch({
        type: FETCH_ALL_EXERCISE,
        payload: values(snapshot.val())
      })
    )
}

export function fetchExercise(id) {
  return dispatch => Exercises.child(id)
    .on('value', snapshot =>
      dispatch({
        type: FETCH_EXERCISE,
        payload: snapshot.val()
      })
    )
}

export function createExercise(data) {
  const _key = Exercises.push().key
  return dispatch => Exercises
    .child(_key)
    .update({...data, _key})
    .then(() =>
      dispatch({
        type: CREATE_EXERCISE,
        payload: data
      })
    )
}

export function checkSolution(key, solution) {
  return dispatch =>
    axios
      .get(`${__FN_PATH__}api/check-exercise`, {params: {key, solution, t:Date.now()}})
      .then(({data}) =>
        dispatch({type: data.valid ? EXERCISE_CHECK_SUCCESS : EXERCISE_CHECK_FAIL})
      )
      .catch((error) => dispatch({type: EXERCISE_CHECK_ERROR, payload: error}))
}