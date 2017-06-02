import {values} from 'ramda'
const DB = window.firebase.database()

export const FETCH_ALL_EXERCISE = 'FETCH_ALL_EXERCISE'
export const FETCH_EXERCISE = 'FETCH_EXERCISE'
export const CREATE_EXERCISE = 'CREATE_EXERCISE'

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
  const _key = Exercises.push().key;
  return dispatch => Exercises
    .child(_key)
    .update({...data, _key, _created: new Date(), draft: true})
    .then(() =>
      dispatch({
        type: CREATE_EXERCISE,
        payload: data
      })
    )
}