import React, { ReactNode, useReducer, Reducer } from 'react'
import { ExerciseModel, ExerciseSubTask, UCUserAnswer } from 'shared/exercise/types'
import { checkSubTask } from '../services/exercise'

type Status = 'pending' | 'checking' | 'checkFailed' | 'solved'

interface SubTaskState extends ExerciseSubTask {
  index: number
  numberOfAttempt: number
  usedHints: number
  hintsLeft: number
  isHintsLeft: boolean
}

interface State {
  status: Status
  exercise: ExerciseModel
  activeSubTask: SubTaskState
  isSingle: boolean
  numberOfTasks: number
  numberOfFinishedTasks: number
  finishedTasks: SubTaskState[]
}

type Action =
  | { type: 'checkSubTask' }
  | { type: 'checkFailed' }
  | { type: 'initNextSubtask' }
  | { type: 'nextHelp' }

interface API {
  getNextHint(): void
  checkActiveSubTask(data: UCUserAnswer[], seed: number): Promise<void>
}

const activeSubTaskInit = {
  index: 0,
  numberOfAttempt: 0,
  usedHints: 0,
  hintsLeft: 0,
  isHintsLeft: false,
} as SubTaskState

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'checkSubTask':
      return {
        ...state,
        status: 'checking',
      }
    case 'checkFailed':
      return {
        ...state,
        status: 'checkFailed',
        activeSubTask: {
          ...state.activeSubTask,
          numberOfAttempt: state.activeSubTask.numberOfAttempt + 1,
        },
      }
    case 'initNextSubtask': {
      const nextTaskIndex = state.activeSubTask.index + 1
      const isDone = nextTaskIndex === state.numberOfTasks
      return {
        ...state,
        status: isDone ? 'solved' : 'pending',
        numberOfFinishedTasks: state.numberOfFinishedTasks + 1,
        finishedTasks: [...state.finishedTasks, state.activeSubTask],
        activeSubTask: isDone
          ? state.activeSubTask
          : initSubTaskStat(state.exercise, state.activeSubTask),
      }
    }

    case 'nextHelp':
      return state
    default:
      return state
  }
}

///

interface Props {
  children: ReactNode
  exercise: ExerciseModel
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ExerciseContext = React.createContext<State>({} as any)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ExerciseDispatchContext = React.createContext<API>({} as any)

function initState(exercise: ExerciseModel): State {
  return {
    status: 'pending',
    exercise,
    activeSubTask: initSubTaskStat(exercise),
    numberOfFinishedTasks: 0,
    isSingle: exercise.subTasks.length === 1,
    numberOfTasks: exercise.subTasks.length,
    finishedTasks: [],
  }
}

function initSubTaskStat(exercise: ExerciseModel, currentSubTask?: SubTaskState): SubTaskState {
  if (currentSubTask) {
    const index = currentSubTask.index + 1
    return {
      ...exercise.subTasks[index],
      ...activeSubTaskInit,
      index,
    }
  } else {
    return { ...exercise.subTasks[0], ...activeSubTaskInit }
  }
}

export function ExerciseProvider({ children, exercise }: Props): JSX.Element {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initState(exercise))

  const api: API = {
    async checkActiveSubTask(data: UCUserAnswer[], seed: number) {
      dispatch({ type: 'checkSubTask' })
      let result = false
      try {
        if (state.exercise.id) {
          result = await checkSubTask(state.exercise.id, seed, 0, data)
        }
      } catch (e) {
        result = false
      } finally {
        dispatch({ type: result ? 'initNextSubtask' : 'checkFailed' })
      }
    },
    getNextHint() {
      throw 'not implemented yet'
    },
  }

  return (
    <ExerciseContext.Provider value={state}>
      <ExerciseDispatchContext.Provider value={api}>{children}</ExerciseDispatchContext.Provider>
    </ExerciseContext.Provider>
  )
}

export function useExercise(): State {
  const context = React.useContext(ExerciseContext)
  if (context === undefined) {
    throw new Error('useExercise must be used within a ExerciseContext')
  }
  return context
}

export function useExerciseDispatch(): API {
  const context = React.useContext(ExerciseDispatchContext)
  if (context === undefined) {
    throw new Error('useExerciseDispatch must be used within a ExerciseDispatchContext')
  }
  return context
}
