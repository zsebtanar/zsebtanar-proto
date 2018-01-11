import {
  __,
  all,
  always,
  append,
  assocPath,
  evolve,
  identity,
  mapObjIndexed,
  pathOr,
  pipe,
  subtract
} from 'ramda'
import { checkSolution, getHint, getPublicExercise } from 'shared/services/exercise'
import { openSignInModal } from 'shared/store/actions/modal'

export const EXERCISE_GET = 'EXERCISE_GET'
export const EXERCISE_GET_ERROR = 'EXERCISE_GET_ERROR'
export const EXERCISE_CHECK_SUCCESS = 'EXERCISE_CHECK_SUCCESS'
export const EXERCISE_CHECK_FAIL = 'EXERCISE_CHECK_FAIL'
export const EXERCISE_CHECK_ERROR = 'EXERCISE_CHECK_ERROR'
export const EXERCISE_DONE = 'EXERCISE_DONE'

export const HINT_GET = 'HINT_GET'
export const HINT_GET_ERROR = 'HINT_GET_ERROR'

export const TASK_STATUS_UNCHECKED = 'unchecked'
export const TASK_STATUS_VALID = 'valid'
export const TASK_STATUS_FAILED = 'failed'

export function getPublicExerciseAction(key) {
  return dispatch =>
    getPublicExercise(key)
      .then(payload => dispatch({ type: EXERCISE_GET, payload }))
      .catch(error => dispatch({ type: EXERCISE_GET_ERROR, error }))
}

export function checkSolutionAction(exerciseId, subTaskId, solutions) {
  return dispatch =>
    checkSolution(exerciseId, subTaskId, solutions)
      .then(({ data }) =>
        dispatch({
          type: all(identity, data.valid) ? EXERCISE_CHECK_SUCCESS : EXERCISE_CHECK_FAIL,
          payload: data,
          meta: {
            exerciseId,
            subTaskId
          }
        })
      )
      .catch(error => dispatch({ type: EXERCISE_CHECK_ERROR, payload: error }))
}

export function getHintAction(exerciseId, subTaskId, lastHintId) {
  return (dispatch, getState) => {
    const state = getState()

    if (!state.app.session.signedIn) {
      return openSignInModal({
        returnPath: window.location.pathname,
        message: 'Jelentkezz be, hogy megtekinthesd a segítséget'
      })
    }

    return getHint(exerciseId, subTaskId, lastHintId)
      .then(({ data }) =>
        dispatch({
          type: HINT_GET,
          payload: data,
          meta: {
            exerciseId,
            subTaskId
          }
        })
      )
      .catch(error => dispatch({ type: HINT_GET_ERROR, payload: error }))
  }
}

/**
 * Reducers
 */

const INIT_STATE = {
  item: undefined
}

export function exerciseReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case EXERCISE_GET:
      return reduceExercise(state, action)
    case HINT_GET:
      return reduceHint(state, action)
    case EXERCISE_CHECK_FAIL:
      return reduceFailedCheck(state, action)
    case EXERCISE_CHECK_SUCCESS:
      return reduceSuccessCheck(state, action)
    case EXERCISE_DONE:
      return INIT_STATE
    default:
      return state
  }
}

const reduceExercise = (state, { payload }) => ({
  item: pipe(
    evolve({
      subTasks: mapObjIndexed(task => ({
        details: task,
        order: task.order,
        taskStatus: TASK_STATUS_UNCHECKED,
        hints: [],
        hintsLeft: pathOr(0, ['hintCount'], task),
        validity: {}
      }))
    }),
    assocPath(['unfinishedSubTasks'], payload.subTasks.length)
  )(payload)
})

const reduceFailedCheck = (state, { meta, payload }) =>
  evolve({
    item: {
      subTasks: {
        [meta.subTaskId]: {
          taskStatus: always(TASK_STATUS_FAILED),
          validity: always(payload.valid)
        }
      }
    }
  })(state)

const reduceSuccessCheck = (state, { payload, meta }) =>
  evolve({
    item: {
      subTasks: {
        [meta.subTaskId]: {
          taskStatus: always(TASK_STATUS_VALID),
          validity: always(payload.valid)
        }
      },
      unfinishedSubTasks: subtract(1)
    }
  })(state)

const reduceHint = (state, { payload, meta }) =>
  evolve({
    item: {
      subTasks: {
        [meta.subTaskId]: {
          hints: append(payload),
          hintsLeft: subtract(__, 1)
        }
      }
    }
  })(state)
