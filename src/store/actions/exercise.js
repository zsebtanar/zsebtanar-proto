const DB = window.firebase.database()

export const CREATE_EXERCISE = 'create-exercise'

const Exercises = DB.ref('exercise')

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