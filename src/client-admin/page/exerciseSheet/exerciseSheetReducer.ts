import { ExerciseSheet, exerciseSheet, exerciseSheetItem } from 'client-common/services/exerciseSheet'
import { DocRef } from 'client-common/services/fireStoreBase'
import { addNotification } from 'client-common/store/notifications'
import { append, assocPath, lensPath, over, pipe, set } from 'ramda'

///

export const EXERCISE_LIST_NEW = 'admin/EXERCISE_LIST_NEW'
export const EXERCISE_LIST_CLONE = 'admin/EXERCISE_LIST_CLONE'
export const EXERCISE_LIST_INIT = 'admin/EXERCISE_LIST_INIT'
export const EXERCISE_LIST_READY = 'admin/EXERCISE_LIST_READY'
export const EXERCISE_LIST_SAVE_START = 'admin/EXERCISE_LIST_SAVE_START'
export const EXERCISE_LIST_SAVED = 'admin/EXERCISE_LIST_SAVED'
export const EXERCISE_LIST_ERROR = 'admin/EXERCISE_LIST_ERROR'
export const EXERCISE_LIST_SET_FIELD = 'admin/EXERCISE_LIST_SET_FIELD'
export const EXERCISE_LIST_REMOVE_EXERCISE = 'admin/EXERCISE_LIST_REMOVE_EXERCISE'

///

const subCollections = ['items']

///

export function newExerciseSheet() {
  return dispatch => {
    dispatch({ type: EXERCISE_LIST_INIT })
    dispatch({ type: EXERCISE_LIST_NEW })
    dispatch({ type: EXERCISE_LIST_READY, payload: NEW_LIST })
  }
}

export function loadExerciseSheet(id) {
  return dispatch => {
    dispatch({ type: EXERCISE_LIST_INIT })
    exerciseSheet
      .get(id, subCollections)
      .then(
        data => {
          dispatch({ type: EXERCISE_LIST_READY, payload: data })
        },
        error => dispatch({ type: EXERCISE_LIST_ERROR, payload: error })
      )
  }
}

export function setExerciseSheetField(lens, value) {
  return {
    type: EXERCISE_LIST_SET_FIELD,
    payload: { lens, value }
  }
}

export function removeExercise(id) {
  return {
    type: EXERCISE_LIST_REMOVE_EXERCISE,
    payload: { id }
  }
}

export function saveExerciseSheet() {
  return async (dispatch, getState: () => state.AdminRoot) => {
    const state = getState().exerciseSheet
    if (state.changed && !state.saving) {
      dispatch({ type: EXERCISE_LIST_SAVE_START })
      const data = { ...state.data }

      try {
        if (data.id && state.removedExercises.length) {
          await exerciseSheetItem(data.id).deleteAll(state.removedExercises)
        }

        const res: DocRef = await exerciseSheet.store(data, { subCollections })

        if (!data.id) {
          window.location.replace(`/admin/exercise-list/edit/${res.id}`)
        } else {
          dispatch({ type: EXERCISE_LIST_SAVED })
        }
        dispatch(addNotification('success', 'Feladatlista elmentve.'))
      } catch (error) {
        dispatch({ type: EXERCISE_LIST_ERROR, payload: error })
      }
    }
  }
}

///

const INIT_STATE: state.AdminExerciseSheet = {
  loading: true,
  mode: 'update',
  changed: false,
  saving: false,
  data: undefined,
  removedExercises: [],
  error: undefined
}

const NEW_LIST: ExerciseSheet = {
  title: 'Új lista',
  randomOrder: false,
  numOfListedItems: 0
}

///
const removedExercisesLens = lensPath(['removedExercises'])

export function exerciseSheetReducer(state = INIT_STATE, action): state.AdminExerciseSheet {
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

    case EXERCISE_LIST_SET_FIELD: {
      const { lens, value } = action.payload
      return pipe(
        set(lens, value),
        assocPath(['changed'], true)
      )(state) as state.AdminExerciseSheet
    }
    case EXERCISE_LIST_REMOVE_EXERCISE: {
      const { id } = action.payload
      if (!id) return

      return pipe(
        over(removedExercisesLens, append(id)),
        assocPath(['changed'], true)
      )(state) as state.AdminExerciseSheet
    }
    default:
      return state
  }
}
