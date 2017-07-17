import { path } from 'ramda'
import { createUser, getUser } from '../services/user'
import { GET_USER } from './user'

const AUTH = firebase.auth()

export const SING_UP_ERROR = 'SING_UP_ERROR'
export const SING_IN_SUCCESS = 'SING_IN_SUCCESS'
export const SING_IN_ERROR = 'SING_IN_ERROR'
export const SING_OUT_SUCCESS = 'SING_OUT_SUCCESS'
export const SING_OUT_ERROR = 'SING_OUT_ERROR'

export function initUser () {
  return AUTH.currentUser
}

export function watchAuth (store) {
  AUTH.onAuthStateChanged(function (user) {
    if (user) {
      getUser(user.uid).then((userDetails) => {
        const state = store.getState()
        if (
          !state.app.session.signedIn &&
          window.location.pathname !== '/admin' &&
          path(['admin'], userDetails)
        ) {
          window.location.replace('/admin')
        } else {
          store.dispatch({type: GET_USER, payload: userDetails})
          store.dispatch({type: SING_IN_SUCCESS, payload: user})
        }
      })
    } else {
      store.dispatch({type: SING_OUT_SUCCESS})
    }
  })
}

export function signUp (email, password, data) {
  return dispatch =>
    AUTH
      .createUserWithEmailAndPassword(email, password)
      .then(user => createUser(user.uid, data))
      .catch(error =>
        dispatch({
          type: SING_UP_ERROR,
          payload: error,
          error: true
        })
      )
}

export function signIn (email, password) {
  return dispatch =>
    AUTH
      .signInWithEmailAndPassword(email, password)
      .catch(error =>
        dispatch({
          type: SING_IN_ERROR,
          payload: error,
          error: true
        })
      )
}

export function signOut () {
  return dispatch =>
    AUTH
      .signOut()
      .then(() => window.location.replace('/'))
      .catch(error => dispatch({
        type: SING_OUT_ERROR,
        payload: error,
        error: true
      }))
}
