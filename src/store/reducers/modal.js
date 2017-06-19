import {pick} from 'ramda'
import {CLOSE_MODAL, OPEN_MODAL} from '../actions/modal'
const initialState = {
  modal: null,
  parameters: {}
}

export default function modal(state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL:
      return pick(['modal', 'parameters'], action.payload)
    case CLOSE_MODAL:
      return initialState
    default:
      return state
  }
}
