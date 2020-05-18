import { createExercise, getPrivateExercise, updateExercise } from 'client-common/services/exercise'
import { assocPath, concat, dissoc, evolve, pipe } from 'ramda'
import { initResources, uploadResources } from '../resources/resourceReducer'

export const EXERCISE_LOADING = 'admin/EXERCISE_LOADING'
export const EXERCISE_NEW = 'admin/EXERCISE_NEW'
export const EXERCISE_LOAD = 'admin/EXERCISE_LOAD'
export const EXERCISE_CLONE = 'admin/EXERCISE_CLONE'
export const EXERCISE_SAVE_START = 'admin/EXERCISE_SAVE_START'
export const EXERCISE_SAVED = 'admin/EXERCISE_SAVED'
export const EXERCISE_ERROR = 'admin/EXERCISE_ERROR'
export const EXERCISE_RESOURCE_ADD = 'admin/EXERCISE_RESOURCE_ADD'
export const EXERCISE_UPDATE_CONTENT = 'admin/EXERCISE_UPDATE_CONTENT'

export function newExercise() {
  return dispatch => {
    dispatch({ type: EXERCISE_LOADING })
    dispatch({ type: EXERCISE_NEW, payload: {} })
    dispatch(initResources({}))
  }
}

export function loadExercise(id) {
  return dispatch => {
    dispatch({ type: EXERCISE_LOADING })
    return getPrivateExercise(id).then(
      data => {
        dispatch({ type: EXERCISE_LOAD, payload: data })
        dispatch(initResources(data.resources || {}))
      },
      error => dispatch({ type: EXERCISE_ERROR, payload: error })
    )
  }
}

export function cloneExercise(id) {
  return dispatch => {
    dispatch({ type: EXERCISE_LOADING })
    return getPrivateExercise(id).then(
      data => {
        dispatch({ type: EXERCISE_CLONE, payload: data })
        dispatch(initResources(data.resources || {}))
      },
      error => dispatch({ type: EXERCISE_ERROR, payload: error })
    )
  }
}

export function updateContent(exerciseData) {
  return dispatch => dispatch({ type: EXERCISE_UPDATE_CONTENT, payload: exerciseData })
}

export function saveExercise() {
  return dispatch =>
    dispatch(uploadResources('exercise'))
      .then(() => dispatch(storeExercise()))
      .catch(error => dispatch({ type: EXERCISE_ERROR, payload: error }))
}

function storeExercise() {
  return (dispatch, getState) => {
    const { exerciseEdit, resources } = getState()

    if (exerciseEdit.changed && !exerciseEdit.saving) {
      dispatch({ type: EXERCISE_SAVE_START })
      const ex = { ...exerciseEdit.data, resources: resources.data }
      const promise = ex._key
        ? updateExercise(ex._key, ex).then(() => dispatch({ type: EXERCISE_SAVED }))
        : createExercise(ex).then(key => window.location.replace(`/admin/exercise/edit/${key}`))

      return promise.catch(error => dispatch({ type: EXERCISE_ERROR, payload: error }))
    }
  }
}

const INIT_STATE = {
  loading: true,
  mode: 'new', // new | update | clone
  changed: false,
  saving: false,
  data: {},
  error: undefined
}

export function exerciseFormReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case EXERCISE_LOADING:
      return { ...INIT_STATE }
    case EXERCISE_NEW:
      return {
        loading: false,
        mode: 'new',
        data: {},
        changed: true
      }
    case EXERCISE_LOAD:
      return {
        loading: false,
        mode: 'update',
        data: action.payload
      }
    case EXERCISE_CLONE:
      return {
        loading: false,
        mode: 'clone',
        data: pipe(
          dissoc('_key'),
          evolve({ title: concat(' [másolat]') })
        )(action.payload),
        changed: true
      }
    case EXERCISE_SAVE_START:
      return {
        ...state,
        saving: true
      }
    case EXERCISE_SAVED:
      return {
        ...state,
        saving: false,
        changed: false
      }
    case EXERCISE_RESOURCE_ADD:
      return pipe(
        assocPath(['resources', action.payload.id], {
          isNew: true,
          url: action.payload.url,
          type: action.payload.file.type,
          name: action.payload.file.name,
          file: action.payload.file
        }),
        assocPath(['changed'], true)
      )(state)
    case EXERCISE_UPDATE_CONTENT:
      return {
        ...state,
        data: action.payload,
        changed: true
      }
    case EXERCISE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
}
