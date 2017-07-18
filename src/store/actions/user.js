import { getUser } from '../../shared/services/user'

export const GET_USER = 'GET_USER'

export function getUserAction (uid) {
  return dispatch => getUser(uid).then(payload =>
    dispatch({type: GET_USER, payload})
  )
}
