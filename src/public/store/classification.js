import { getAllClassification } from 'shared/services/classification'

export const GET_CLASSIFICATIONS = 'GET_CLASSIFICATIONS'

export function initClassifications (store) {
  store.dispatch(getAllClassificationAction())
}

export function getAllClassificationAction () {
  return dispatch => getAllClassification().then(payload =>
    dispatch({type: GET_CLASSIFICATIONS, payload})
  )
}

const INIT_STATE = null

export default function classificationReducer (state = INIT_STATE, action) {
  switch (action.type) {
    case GET_CLASSIFICATIONS:
      console.log(action)
      return action.payload
    default:
      return state
  }
}
