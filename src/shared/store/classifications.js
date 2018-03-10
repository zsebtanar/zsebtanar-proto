import { getAllClassification } from 'shared/services/classification'

const CLASSIFICATION_LIST = 'shared/CLASSIFICATION_LIST'
const CLASSIFICATION_LIST_START = 'shared/CLASSIFICATION_START'
const CLASSIFICATION_ERROR = 'shared/CLASSIFICATION_ERROR'

export function getClassifications() {
  return dispatch => {
    dispatch({ type: CLASSIFICATION_LIST_START })
    return getAllClassification().then(
      data => dispatch({ type: CLASSIFICATION_LIST, payload: data }),
      error => dispatch({ type: CLASSIFICATION_ERROR, payload: error })
    )
  }
}

const INIT_STATE = {
  data: {},
  loading: true,
  error: undefined
}

export function classificationReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case CLASSIFICATION_LIST_START:
      return {
        ...state,
        loading: true,
        error: undefined
      }
    case CLASSIFICATION_LIST:
      return {
        data: action.payload,
        loading: false
      }
    case CLASSIFICATION_ERROR:
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}
