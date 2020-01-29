import { app, firebase } from 'client/generic/services/fireApp'
import { getUserAction, parseTokenAction } from 'client-common/store/reducers/session'
import { removeUserData, updateUserProfile } from 'client/user/services/user'
import { logException } from 'client/generic/utils/logger'
import { addNotification } from '../notifications'

const AUTH = app.auth()

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
      store.dispatch({ type: SIGN_IN_SUCCESS, payload: { user } })
      store.dispatch(
        addNotification('success', 'Sikeres bejelentkezés.', { timeout: 3 })
      )
      store.dispatch(getUserAction(user.uid))
      store.dispatch(parseTokenAction(user))
    } else {
      store.dispatch({ type: AUTH_NO_USER })
    }
  })
}

export function signUp(email, password, { displayName }): any {
  return dispatch => {
    dispatch({ type: SIGN_UP_START })
    return AUTH.createUserWithEmailAndPassword(email, password)
      .then(user => updateUserProfile(user.user.uid, { displayName }))
      .then(res => dispatch({ type: USER_SIGN_UP_FINISHED, payload: { user: res.data } }))
      .catch(handleError(SIGN_UP_ERROR, dispatch))
  }
}

export function signIn(email, password): any {
  return dispatch => {
    dispatch({ type: SIGN_IN_START })
    return AUTH.signInWithEmailAndPassword(email, password).catch(
      handleError(SIGN_IN_ERROR, dispatch)
    )
  }
}

export function forgotPassword(email: string): Promise<any> {
  return AUTH.sendPasswordResetEmail(email, { url: window.location.href })
}

export function googleSignIn(): any {
  return dispatch => {
    dispatch({ type: SSO_SIGN_IN_START })
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('email')
    provider.addScope('profile')
    return AUTH.signInWithPopup(provider).catch(handleError(SSO_SIGN_IN_ERROR, dispatch))
  }
}

export function facebookSignIn(): any {
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
    Promise.all([AUTH.currentUser.delete(), removeUserData(AUTH.currentUser.uid)])
      .then(() => window.location.replace('/'))
      .catch(logException)
}

const handleError = (type, dispatch) => error => {
  logException(error)
  dispatch({ type, payload: error, error: true })
}
