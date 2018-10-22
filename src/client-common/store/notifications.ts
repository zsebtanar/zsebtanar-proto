import { uid } from '../util/uuid'
import { idNotEq } from 'shared/util/fn'
import { isPositiveInt } from '../../shared/util/math'

export const ADD_NOTIFICATION = 'common/ADD_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'common/REMOVE_NOTIFICATION'

///

export function addNotification(
  type: NotificationType,
  message: string,
  options: NotificationOptions = {}
) {
  return dispatch => {
    const id = uid()

    if (isPositiveInt(options.timeout)) {
      setTimeout(() => dispatch(removeNotification(id)), options.timeout * 1000)
    }

    dispatch({
      type: ADD_NOTIFICATION,
      payload: { id, type, message, options }
    })
  }
}

export function removeNotification(id) {
  return { type: REMOVE_NOTIFICATION, id }
}

///

const initialState = {
  list: []
}

export function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return {
        list: [
          ...state.list,
          {
            ...action.payload
          }
        ]
      }
    case REMOVE_NOTIFICATION:
      return { list: state.list.filter(idNotEq(action.id)) }
    default:
      return state
  }
}
