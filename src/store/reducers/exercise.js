import {FETCH_EXERCISE, FETCH_ALL_EXERCISE} from '../actions/exercise'

const INIT_STATE = {
  active: null,
  list: []
}

export default function exerciseWorkflow(state=INIT_STATE, action) {
  switch (action.type) {
    case FETCH_ALL_EXERCISE:
      return {...state, list: action.payload}
    case FETCH_EXERCISE:
      return {...state, active: action.payload}
    default:
      return state
  }
}