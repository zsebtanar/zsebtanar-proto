import { getUser } from '../../services/user'
import {
  SING_IN_ERROR,
  SING_IN_START,
  SING_IN_SUCCESS,
  SING_OUT_ERROR,
  SING_OUT_SUCCESS,
  SING_UP_ERROR
} from '../actions/auth'
import { CLOSE_MODAL } from 'shared/store/actions/modal'
import { AUTH_NO_USER } from 'shared/store/actions/auth'

export const GET_USER = 'GET_USER'

export function getUserAction(uid) {
  return dispatch => getUser(uid).then(payload => dispatch({ type: GET_USER, payload }))
}

const INIT_STATE = {
  waitingForUser: true,
  signedIn: false,
  user: undefined,
  error: null,
  autoSignIn: true
}

export default function sessionWorkflow(state = INIT_STATE, action) {
  switch (action.type) {
    case AUTH_NO_USER:
      return { ...state, waitingForUser: false }
    case GET_USER:
      return { ...state, userDetails: action.payload, waitingForUser: false }
    case SING_IN_START:
      return { ...state, autoSignIn: false }
    case SING_IN_SUCCESS:
      return {
        ...state,
        signedIn: true,
        user: action.payload.user,
        userDetails: action.payload.userDetails,
        error: null,
        waitingForUser: false
      }
    case SING_IN_ERROR:
    case SING_UP_ERROR:
      return { signedIn: false, user: null, userDetails: null, error: action.payload }
    case SING_OUT_SUCCESS:
      return { signedIn: false, user: null, userDetails: null, error: null }
    case SING_OUT_ERROR:
      return { ...state, error: action.payload }
    case CLOSE_MODAL:
      return { ...state, error: null }
    default:
      return state
  }
}
