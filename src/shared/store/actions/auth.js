import { getUserAction, parseTokenAction } from 'shared/store/reducers/session'
import { updateUserProfile } from 'shared/services/user'

const AUTH = firebase.auth()

export const SING_UP_ERROR = 'SING_UP_ERROR'
export const SING_IN_SUCCESS = 'SING_IN_SUCCESS'
export const USER_UPDATE = 'USER_UPDATE'
export const SING_IN_ERROR = 'SING_IN_ERROR'
export const SING_IN_START = 'SING_IN_START'
export const SING_OUT_SUCCESS = 'SING_OUT_SUCCESS'
export const SING_OUT_ERROR = 'SING_OUT_ERROR'
export const AUTH_NO_USER = 'AUTH_NO_USER'

export function initAuthWatch(store) {
  AUTH.onAuthStateChanged(function(user) {
    if (user) {
      setRavenUser(user.uid)
      store.dispatch({ type: SING_IN_SUCCESS, payload: { user } })
      store.dispatch(getUserAction(user.uid))
      store.dispatch(parseTokenAction(user))
    } else {
      setRavenUser(undefined)
      store.dispatch({ type: AUTH_NO_USER })
    }
  })
}

export function signUp(email, password, { displayName }) {
  return dispatch =>
    AUTH.createUserWithEmailAndPassword(email, password)
      .then(user => updateUserProfile(user.uid, { displayName }))
      .then(res => dispatch({ type: USER_UPDATE, payload: { user: res.data } }))
      .catch(handleError(SING_UP_ERROR, dispatch))
}

export function signIn(email, password) {
  return dispatch => {
    dispatch({ type: SING_IN_START })
    return AUTH.signInWithEmailAndPassword(email, password).catch(
      handleError(SING_IN_ERROR, dispatch)
    )
  }
}

export function googleSignIn() {
  return dispatch => {
    dispatch({ type: SING_IN_START })
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('email')
    provider.addScope('profile')
    return AUTH.signInWithPopup(provider).catch(handleError(SING_IN_ERROR, dispatch))
  }
}

export function facebookSignIn() {
  return dispatch => {
    dispatch({ type: SING_IN_START })
    const provider = new firebase.auth.FacebookAuthProvider()
    provider.addScope('email')
    provider.addScope('public_profile')
    return AUTH.signInWithPopup(provider).catch(handleError(SING_IN_ERROR, dispatch))
  }
}

export function signOut() {
  return dispatch =>
    AUTH.signOut()
      .then(() => window.location.replace('/'))
      .catch(handleError(SING_OUT_ERROR, dispatch))
}

const setRavenUser = id => (typeof Raven !== 'undefined' ? Raven.setUserContext({ id }) : undefined)

const handleError = (type, dispatch) => error => dispatch({ type, payload: error, error: true })
