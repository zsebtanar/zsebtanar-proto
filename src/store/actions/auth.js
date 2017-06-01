const AUTH = firebase.auth()

export const SING_UP_ERROR = 'SING_UP_ERROR'
export const SING_IN_SUCCESS = 'SING_IN_SUCCESS'
export const SING_IN_ERROR = 'SING_IN_ERROR'
export const SING_OUT_SUCCESS = 'SING_OUT_SUCCESS'
export const SING_OUT_ERROR = 'SING_OUT_ERROR'

export function initUser() {
  return AUTH.currentUser
}

export function watchAuth(store) {
  AUTH.onAuthStateChanged(function (user) {
    if (user) {
      store.dispatch({type: SING_IN_SUCCESS, payload: user})
    } else {
      store.dispatch({type: SING_OUT_SUCCESS})
    }
  })
}

export function signUp(email, password) {
  return dispatch =>
    AUTH
      .createUserWithEmailAndPassword(email, password)
      .catch(error =>
        dispatch({
          type: SING_UP_ERROR,
          payload: error
        })
      )
}

export function signIn(email, password) {
  return dispatch =>
    AUTH
      .signInWithEmailAndPassword(email, password)
      .catch(error =>
        dispatch({
          type: SING_IN_ERROR,
          payload: error
        })
      )
}


export function signOut() {

  return dispatch =>
    AUTH
      .signOut()
      .catch(error => dispatch({
        type: SING_OUT_ERROR,
        payload: error
      }))
}