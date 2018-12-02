import { ExerciseList, exerciseList } from 'client-common/services/exercise-list'
import { addNotification } from 'client-common/store/notifications'
import { assocPath, pipe } from 'ramda'

///

export const EXERCISE_LIST_NEW = 'admin/EXERCISE_LIST_NEW'
export const EXERCISE_LIST_CLONE = 'admin/EXERCISE_LIST_CLONE'
export const EXERCISE_LIST_INIT = 'admin/EXERCISE_LIST_INIT'
export const EXERCISE_LIST_READY = 'admin/EXERCISE_LIST_READY'
export const EXERCISE_LIST_SAVE_START = 'admin/EXERCISE_LIST_SAVE_START'
export const EXERCISE_LIST_SAVED = 'admin/EXERCISE_LIST_SAVED'
export const EXERCISE_LIST_ERROR = 'admin/EXERCISE_LIST_ERROR'
export const EXERCISE_LIST_SET_FIELD = 'admin/EXERCISE_LIST_SET_FIELD'

///

const subCollections = ['items']

///

export function newExerciseList() {
  return dispatch => {
    dispatch({ type: EXERCISE_LIST_INIT })
    dispatch({ type: EXERCISE_LIST_NEW })
    dispatch({ type: EXERCISE_LIST_READY, payload: NEW_LIST })
  }
}

export function loadExerciseList(id) {
  return dispatch => {
    dispatch({ type: EXERCISE_LIST_INIT })
    exerciseList
      .get(id, subCollections)
      .then(
        data => dispatch({ type: EXERCISE_LIST_READY, payload: data }),
        error => dispatch({ type: EXERCISE_LIST_ERROR, payload: error })
      )
  }
}

export function setExerciseListField(path, value) {
  return {
    type: EXERCISE_LIST_SET_FIELD,
    payload: { path, value }
  }
}

export function saveExerciseList() {
  return (dispatch, getState: () => state.AdminRoot) => {
    const state = getState().exerciseList
    if (state.changed && !state.saving) {
      dispatch({ type: EXERCISE_LIST_SAVE_START })
      const data = { ...state.data }

      return exerciseList.store(data, subCollections).then(
        (res: firebase.firestore.DocumentReference) => {
          if (!data.id) {
            window.location.replace(`/admin/exercise-list/edit/${res.id}`)
          } else {
            dispatch({ type: EXERCISE_LIST_SAVED })
          }
          dispatch(addNotification('success', 'Feladatlista elmentve.'))
        },
        error => dispatch({ type: EXERCISE_LIST_ERROR, payload: error })
      )
    }
  }
}

///

const INIT_STATE: state.AdminExerciseList = {
  loading: true,
  mode: 'update',
  changed: false,
  saving: false,
  data: undefined,
  error: undefined
}

const NEW_LIST: ExerciseList = {
  title: 'Új lista'
}

///

export function exerciseListFormReducer(state = INIT_STATE, action): state.AdminExerciseList {
  switch (action.type) {
    case EXERCISE_LIST_INIT:
      return { ...INIT_STATE }

    case EXERCISE_LIST_NEW:
      return { ...state, mode: 'new' }

    case EXERCISE_LIST_CLONE:
      return { ...state, mode: 'clone' }

    case EXERCISE_LIST_READY:
      return { ...state, loading: false, data: action.payload }

    case EXERCISE_LIST_SAVE_START:
      return { ...state, saving: true }

    case EXERCISE_LIST_SAVED:
      return { ...state, saving: false, changed: false }

    case EXERCISE_LIST_ERROR:
      return { ...state, error: action.payload, loading: false, saving: false }

    case EXERCISE_LIST_SET_FIELD:
      const { path, value } = action.payload
      return pipe(
        assocPath(path, value),
        assocPath(['changed'], true)
      )(state) as state.AdminExerciseList
    default:
      return state
  }
}
