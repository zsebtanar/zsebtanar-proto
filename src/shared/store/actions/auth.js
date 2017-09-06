import { pathOr } from 'ramda'
import { createUser, getUser } from '../../services/user'
import { openProviderSignUp } from 'shared/store/actions/modal'

const AUTH = firebase.auth()

export const SING_UP_ERROR = 'SING_UP_ERROR'
export const SING_IN_SUCCESS = 'SING_IN_SUCCESS'
export const SING_IN_ERROR = 'SING_IN_ERROR'
export const SING_IN_START = 'SING_IN_START'
export const SING_OUT_SUCCESS = 'SING_OUT_SUCCESS'
export const SING_OUT_ERROR = 'SING_OUT_ERROR'
export const AUTH_NO_USER = 'AUTH_NO_USER'

export function initAuthWatch(store) {
  AUTH.onAuthStateChanged(function(user) {
    if (user) {
      if (typeof Raven !== 'undefined') Raven.setUserContext({ id: user.uid })
      getUser(user.uid).then(userDetailsHandler(store, user))
    } else {
      if (typeof Raven !== 'undefined') Raven.setUserContext()
      if (pathOr(false, ['app', 'session', 'signedIn'], store.getState())) {
        window.location.replace('/')
      } else {
        store.dispatch({ type: AUTH_NO_USER })
      }
    }
  })
}

const userDetailsHandler = (store, user) => userDetails => {
  if (userDetails) {
    processUser(store, user, userDetails)
  } else {
    store.dispatch(
      openProviderSignUp({
        data: { email: user.email, name: user.displayName },
        onSave: data => {
          createUser(user.uid, data)
            .then(() => getUser(user.uid))
            .then(userDetails => processUser(store, user, userDetails))
            .catch(handleError(SING_UP_ERROR, store.dispatch))
        }
      })
    )
  }
}

const processUser = (store, user, userDetails) => {
  const state = store.getState()
  store.dispatch({ type: SING_IN_SUCCESS, payload: { user, userDetails } })
  if (!pathOr(true, ['app', 'session', 'autoSignIn'], state)) {
    // state.history.props.history.push('/')
  }
}

const handleError = (type, dispatch) => error => dispatch({ type, payload: error, error: true })

export function signUp(email, password, data) {
  return dispatch =>
    AUTH.createUserWithEmailAndPassword(email, password)
      .then(user => createUser(user.uid, { ...data, email }))
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
    return AUTH.signInWithPopup(provider).catch(handleError(SING_IN_ERROR, dispatch))
  }
}

export function facebookSignIn() {
  return dispatch => {
    dispatch({ type: SING_IN_START })
    const provider = new firebase.auth.FacebookAuthProvider()
    provider.addScope('email')
    return AUTH.signInWithPopup(provider).catch(handleError(SING_IN_ERROR, dispatch))
  }
}

export function signOut() {
  return (dispatch, getState) => AUTH.signOut().catch(handleError(SING_OUT_ERROR, dispatch))
}
