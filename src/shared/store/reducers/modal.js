import { curry, not, pick, pipe, propEq } from 'ramda'
import { CLOSE_MODAL, OPEN_MODAL } from '../actions/modal'
import { uid } from '../../util/uuid'

const initialState = {
  modals: []
}

const getModal = pick(['modal', 'parameters'])
const idNotEq = curry(pipe(propEq('id'), not))

export default function modal (state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        modals: [
          ...state.modals,
          {
            id: uid(),
            ...getModal(action.payload)
          }
        ]
      }
    case CLOSE_MODAL:
      return {modals: state.modals.filter(idNotEq(action.payload))}
    default:
      return state
  }
}
