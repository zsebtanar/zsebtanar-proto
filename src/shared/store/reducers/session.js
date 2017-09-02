import { getUser } from '../../services/user'
import {
  initUser,
  SING_IN_ERROR,
  SING_IN_START,
  SING_IN_SUCCESS,
  SING_OUT_ERROR,
  SING_OUT_SUCCESS,
  SING_UP_ERROR
} from '../actions/auth'
import { CLOSE_MODAL } from 'shared/store/actions/modal'

export const GET_USER = 'GET_USER'

export function getUserAction (uid) {
  return dispatch => getUser(uid).then(payload =>
    dispatch({type: GET_USER, payload})
  )
}

const user = initUser()
const INIT_STATE = {signedIn: !!user, user, error: null, autoSignIn: true}

export default function sessionWorkflow (state = INIT_STATE, action) {
  switch (action.type) {
    case GET_USER:
      return {...state, userDetails: action.payload}
    case SING_IN_START:
      return {...state, autoSignIn: false}
    case SING_IN_SUCCESS:
      return {
        ...state,
        signedIn: true,
        user: action.payload.user,
        userDetails: action.payload.userDetails,
        error: null
      }
    case SING_IN_ERROR:
    case SING_UP_ERROR:
      return {signedIn: false, user: null, userDetails: null, error: action.payload}
    case SING_OUT_SUCCESS:
      return {signedIn: false, user: null, userDetails: null, error: null}
    case SING_OUT_ERROR:
      return {...state, error: action.payload}
    case CLOSE_MODAL:
      return {...state, error: null}
    default:
      return state
  }
}
