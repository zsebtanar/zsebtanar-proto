import ReactGA from 'react-ga'
import { getUserAction, parseTokenAction } from 'shared/store/reducers/session'
import { updateUserProfile } from 'shared/services/user'
const AUTH = firebase.auth()

export const SIGN_UP_ERROR = 'SIGN_UP_ERROR'
export const SIGN_UP_START = 'SIGN_UP_START'
export const USER_SIGN_UP_FINISHED = 'USER_SIGN_UP_FINISHED'
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS'
export const SSO_SIGN_IN_START = 'SSO_SIGN_IN_START'
export const SSO_SIGN_IN_ERROR = 'SSO_SIGN_IN_ERROR'
export const SIGN_IN_ERROR = 'SIGN_IN_ERROR'
export const SIGN_IN_START = 'SIGN_IN_START'
export const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS'
export const SIGN_OUT_ERROR = 'SIGN_OUT_ERROR'
export const AUTH_NO_USER = 'AUTH_NO_USER'
export const DELETE_USER_ERROR = 'DELETE_USER_ERROR'

export function initAuthWatch(store) {
  AUTH.onAuthStateChanged(function(user) {
    if (user) {
      ReactGA.set({ userId: user.uid })
      setRavenUser(user.uid)
      store.dispatch({ type: SIGN_IN_SUCCESS, payload: { user } })
      store.dispatch(getUserAction(user.uid))
      store.dispatch(parseTokenAction(user))
    } else {
      ReactGA.set({ userId: undefined })
      setRavenUser(undefined)
      store.dispatch({ type: AUTH_NO_USER })
    }
  })
}

export function signUp(email, password, { displayName }) {
  return dispatch => {
    dispatch({ type: SIGN_UP_START })
    return AUTH.createUserWithEmailAndPassword(email, password)
      .then(user => updateUserProfile(user.uid, { displayName }))
      .then(res => dispatch({ type: USER_SIGN_UP_FINISHED, payload: { user: res.data } }))
      .catch(handleError(SIGN_UP_ERROR, dispatch))
  }
}

export function signIn(email, password) {
  return dispatch => {
    dispatch({ type: SIGN_IN_START })
    return AUTH.signInWithEmailAndPassword(email, password).catch(
      handleError(SIGN_IN_ERROR, dispatch)
    )
  }
}

export function googleSignIn() {
  return dispatch => {
    dispatch({ type: SSO_SIGN_IN_START })
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('email')
    provider.addScope('profile')
    return AUTH.signInWithPopup(provider).catch(handleError(SSO_SIGN_IN_ERROR, dispatch))
  }
}

export function facebookSignIn() {
  return dispatch => {
    dispatch({ type: SSO_SIGN_IN_START })
    const provider = new firebase.auth.FacebookAuthProvider()
    provider.addScope('email')
    provider.addScope('public_profile')
    return AUTH.signInWithPopup(provider).catch(handleError(SSO_SIGN_IN_ERROR, dispatch))
  }
}

export function signOut() {
  return dispatch =>
    AUTH.signOut()
      .then(() => window.location.replace('/'))
      .catch(handleError(SIGN_OUT_ERROR, dispatch))
}

export function deleteUser() {
  return () =>
    AUTH.currentUser
      .delete()
      .then(() => window.location.replace('/'))
      .catch(ravenCapture)
}

const setRavenUser = id => (typeof Raven !== 'undefined' ? Raven.setUserContext({ id }) : undefined)
const ravenCapture = error =>
  typeof Raven !== 'undefined' ? Raven.captureException(error) : undefined

const handleError = (type, dispatch) => error => dispatch({ type, payload: error, error: true })
