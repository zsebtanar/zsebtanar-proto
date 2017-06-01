import {
  initUser, SING_IN_ERROR, SING_IN_SUCCESS, SING_OUT_ERROR, SING_OUT_SUCCESS,
  SING_UP_ERROR
} from '../actions/auth'

const userData = initUser()
const INIT_STATE = {signedIn: !!userData, userData, error: null}

export default function sessionWorkflow(state=INIT_STATE, action) {
  switch (action.type) {
    case SING_IN_SUCCESS:
      return {signedIn: true, userData: action.payload, error: null}
    case SING_IN_ERROR:
    case SING_UP_ERROR:
      return {signedIn: false, userData: null, error: action.payload}
    case SING_OUT_SUCCESS:
      return {signedIn: false, userData: null, error: null}
    case SING_OUT_ERROR:
      return {...state, error: action.payload}
    default:
      return state
  }
}