import { curry, not, pipe, propEq } from 'ramda'
import { CLOSE_MODAL, OPEN_MODAL } from '../actions/modal'
import { uid } from '../../util/uuid'

const initialState: state.AppModal = {
  modals: []
}

const idNotEq = curry(
  pipe(
    propEq('id'),
    not
  )
)

export default function modal(state: state.AppModal = initialState, action): state.AppModal {
  switch (action.type) {
    case OPEN_MODAL: {
      const { modalComponent, parameters } = action.payload
      return {
        modals: [
          ...state.modals,
          {
            id: uid(),
            modalComponent,
            parameters
          }
        ]
      }
    }
    case CLOSE_MODAL:
      return { modals: state.modals.filter(idNotEq(action.payload)) }
    default:
      return state
  }
}
