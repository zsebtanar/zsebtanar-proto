import { getUserDetails, parseToken } from '../../services/user'
import {
  AUTH_NO_USER,
  SIGN_IN_ERROR,
  SIGN_IN_START,
  SIGN_IN_SUCCESS,
  SIGN_OUT_ERROR,
  SIGN_OUT_SUCCESS,
  SIGN_UP_ERROR,
  SIGN_UP_START,
  SSO_SIGN_IN_START,
  USER_SIGN_UP_FINISHED
} from '../actions/auth'
import { CLOSE_MODAL } from 'shared/store/actions/modal'

export const GET_USER_DETAILS = 'GET_USER_DETAILS'
export const USER_TOKEN = 'USER_TOKEN'

export function getUserAction(uid) {
  return dispatch =>
    getUserDetails(uid).then(payload => dispatch({ type: GET_USER_DETAILS, payload }))
}

export function parseTokenAction(currentUser, force) {
  return dispatch =>
    parseToken(currentUser, force).then(payload => dispatch({ type: USER_TOKEN, payload }))
}

const INIT_STATE = {
  waitingForUser: true,
  signInLoading: false,
  emailSignUpLoading: false,
  signedIn: false,
  user: undefined,
  userDetails: {},
  token: {},
  error: undefined,
  autoSignIn: true
}

export default function sessionWorkflow(state = INIT_STATE, action) {
  switch (action.type) {
    case AUTH_NO_USER:
      return { ...state, waitingForUser: false }
    case SIGN_UP_START:
      return { ...state, emailSignUpLoading: true, autoSignIn: false }
    case SIGN_IN_START:
    case SSO_SIGN_IN_START:
      return { ...state, signInLoading: true, autoSignIn: false }
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        signedIn: true,
        user: action.payload.user,
        error: null,
        signInLoading: false,
        waitingForUser: false
      }
    case USER_SIGN_UP_FINISHED:
      return {
        ...state,
        emailSignUpLoading: false,
        user: { ...state.user, ...action.payload.user }
      }
    case GET_USER_DETAILS:
      return { ...state, userDetails: action.payload }
    case USER_TOKEN:
      return { ...state, token: action.payload }
    case SIGN_IN_ERROR:
    case SIGN_UP_ERROR:
      return {
        signedIn: false,
        user: null,
        userDetails: null,
        signInLoading: false,
        emailSignUpLoading: false,
        error: action.payload
      }
    case SIGN_OUT_SUCCESS:
      return { ...INIT_STATE }
    case SIGN_OUT_ERROR:
      return { ...state, error: action.payload }
    case CLOSE_MODAL:
      return { ...state, error: null }
    default:
      return state
  }
}
