const DB = window.firebase.database()

export const FETCH_DATA = 'fetch-data'
export const DELETE_DATA = 'delete-data'
export const CREATE_DATA = 'create-data'
export const UPDATE_DATA = 'update-data'

const data = DB.ref('data')

export function fetchData() {
  return dispatch => data
    .on('value', snapshot =>
      dispatch({
        type: FETCH_DATA,
        payload: snapshot.val()
      })
    )
}

export function removeData(key){
  return dispatch => data.child(key).remove()
}

export function createData(data){
  data._key = data.push().key;
  return dispatch => data.child(data._key).update(data)
}

export function updateData(key, data) {
  return dispatch => data.child(key).update(data)
}

