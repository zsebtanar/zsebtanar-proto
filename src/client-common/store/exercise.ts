import {
  add,
  all,
  always,
  append,
  assocPath,
  evolve,
  flip,
  identity,
  keys,
  mapObjIndexed,
  pathOr,
  pipe,
  subtract,
  values
} from 'ramda'
import { checkSolution, getHint, getPublicExercise } from 'client-common/services/exercise'
import { openSignInModal } from 'client-common/store/actions/modal'
import { pairsInOrder } from 'shared/util/fn'

export const EXERCISE_INIT = 'EXERCISE_INIT'
export const EXERCISE_GET = 'EXERCISE_GET'
export const EXERCISE_GET_ERROR = 'EXERCISE_GET_ERROR'
export const EXERCISE_CHECK_SUCCESS = 'EXERCISE_CHECK_SUCCESS'
export const EXERCISE_CHECK_FAIL = 'EXERCISE_CHECK_FAIL'
export const EXERCISE_CHECK_ERROR = 'EXERCISE_CHECK_ERROR'
export const EXERCISE_NEXT_SUB_TASK = 'EXERCISE_NEXT_SUB_TASK'

export const HINT_GET = 'HINT_GET'
export const HINT_GET_ERROR = 'HINT_GET_ERROR'

export const TASK_STATUS_WAITING = 'waiting'
export const TASK_STATUS_ACTIVE = 'active'
export const TASK_STATUS_FAILED = 'failed'
export const TASK_STATUS_DONE = 'done'
export const TASK_STATUS_PREVIEW = 'preview'

export function getPublicExerciseAction(key) {
  return dispatch => {
    dispatch({ type: EXERCISE_INIT })
    return getPublicExercise(key)
      .then(payload => dispatch({ type: EXERCISE_GET, payload }))
      .then(() => dispatch(activateNextSubTask()))
      .catch(error => dispatch({ type: EXERCISE_GET_ERROR, error }))
  }
}

export function unloadExerciseAction() {
  return dispatch => dispatch({ type: EXERCISE_INIT })
}

export function checkSolutionAction(exerciseId, subTaskId, solutions): any {
  return (dispatch, getState) =>
    checkSolution(exerciseId, subTaskId, solutions)
      .then(({ data }) => {
        const isValid = all(identity as (any) => boolean, values(data.valid))

        dispatch({
          type: isValid ? EXERCISE_CHECK_SUCCESS : EXERCISE_CHECK_FAIL,
          payload: data,
          meta: {
            exerciseId,
            subTaskId
          }
        })

        if (isValid) {
          dispatch(activateNextSubTask())
        }
      })
      .catch(error => dispatch({ type: EXERCISE_CHECK_ERROR, payload: error }))
}

export function getHintAction(exerciseId, subTaskId, lastHintId): any {
  return (dispatch, getState) => {
    const state = getState()

    if (!state.app.session.signedIn) {
      return Promise.resolve(
        dispatch(
          openSignInModal({
            returnPath: window.location.pathname,
            message: 'Jelentkezz be, hogy megtekinthesd a segítséget'
          })
        )
      )
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

export function activateNextSubTask() {
  return { type: EXERCISE_NEXT_SUB_TASK }
}

/**
 * Reducers
 */

const INIT_STATE = {
  item: undefined,
  error: undefined
}

export function exerciseReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case EXERCISE_INIT:
      return INIT_STATE
    case EXERCISE_GET:
      return reduceExercise(state, action)
    case HINT_GET:
      return reduceHint(state, action)
    case EXERCISE_GET_ERROR:
      return reduceError(state, action)
    case EXERCISE_NEXT_SUB_TASK:
      return reduceNextSubTask(state)
    case EXERCISE_CHECK_FAIL:
      return reduceFailedCheck(state, action)
    case EXERCISE_CHECK_SUCCESS:
      return reduceSuccessCheck(state, action)
    default:
      return state
  }
}

const reduceExercise = (state, { payload }) => ({
  item: pipe(
    evolve({
      subTasks: mapObjIndexed((task: DB.SubTask) => ({
        details: task,
        order: task.order,
        status: TASK_STATUS_WAITING,
        hints: [],
        hintsLeft: pathOr(0, ['hintCount'], task),
        validity: {}
      }))
    }),
    assocPath(['allTasks'], keys(payload.subTasks).length),
    assocPath(['finishedTasks'], 0),
    assocPath(['taskOrder'], pairsInOrder(payload.subTasks).map(([id]) => id)),
    assocPath(['isFinished'], false)
  )(payload)
})

const reduceNextSubTask = state => {
  const nextTaskIdx = state.item.nextTask || 0
  const nextTaskId = state.item.taskOrder[nextTaskIdx]
  if (nextTaskId) {
    return pipe(
      assocPath(['item', 'subTasks', nextTaskId, 'status'], TASK_STATUS_ACTIVE),
      assocPath(['item', 'nextTask'], nextTaskIdx + 1)
    )(state)
  } else {
    return state
  }
}

const reduceFailedCheck = (state, { meta, payload }) =>
  evolve({
    item: {
      subTasks: {
        [meta.subTaskId]: {
          status: always(TASK_STATUS_FAILED),
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
          status: always(TASK_STATUS_DONE),
          validity: always(payload.valid)
        }
      },
      finishedTasks: add(1),
      isFinished: always(state.item.finishedTasks + 1 === state.item.allTasks)
    }
  })(state)

const reduceHint = (state, { payload, meta }) =>
  evolve({
    item: {
      subTasks: {
        [meta.subTaskId]: {
          hints: append(payload),
          hintsLeft: flip(subtract)(1)
        }
      }
    }
  })(state)

const reduceError = (state, { error }) => ({ error })
