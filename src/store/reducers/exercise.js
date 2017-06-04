import {
  FETCH_EXERCISE,
  FETCH_ALL_EXERCISE,
  EXERCISE_CHECK_SUCCESS,
  EXERCISE_CHECK_FAIL
} from '../actions/exercise'

const INIT_STATE = {
  active: null,
  list: []
}

export default function exerciseWorkflow(state=INIT_STATE, action) {
  switch (action.type) {
    case FETCH_ALL_EXERCISE:
      return {...state, list: action.payload}
    case FETCH_EXERCISE:
      return {...state, active: {details: action.payload, state: 'in-progress'}}
    case EXERCISE_CHECK_SUCCESS:
      return {...state, active: {...state.active, state: 'success'}}
    case EXERCISE_CHECK_FAIL:
      return {...state, active: {...state.active, state: 'fail'}}
    default:
      return state
  }
}