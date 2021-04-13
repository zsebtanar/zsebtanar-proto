import React, { ReactNode, useReducer, Reducer } from 'react'
import * as dp from 'dot-prop-immutable'
import { PublicExercise, PublicExerciseSubtask, UCUserAnswer } from 'shared/exercise/types'
import { checkSubTask, getNextHint } from '../services/exercise'

type Status = 'pending' | 'checking' | 'checkFailed' | 'solved'

type SubtaskStatus = 'done' | 'current' | 'waiting'

interface State {
  status: Status
  exercise: PublicExercise
  subTasks: SubTaskState[]
  selectedSubtask: SubTaskState
  isSingle: boolean
  numberOfTasks: number
  numberOfFinishedTasks: number
  isCurrentSubtaskActive: boolean
}

interface SubTaskState extends PublicExerciseSubtask {
  index: number
  status: SubtaskStatus
  answers: UCUserAnswer[]
  numberOfAttempt: number
  isHintsLeft: boolean
  hints: string[]
}

type Action =
  | { type: 'checkSubTask' }
  | { type: 'checkFailed' }
  | { type: 'initNextSubtask'; previousAnswers: UCUserAnswer[] }
  | { type: 'nextHint'; hint: string; hasMoreHints: boolean }
  | { type: 'selectSubtask'; index: number }
  | { type: 'storeActiveSubtaskAnswer'; answer: UCUserAnswer[] }

interface API {
  getNextHint(): void
  checkActiveSubTask(data: UCUserAnswer[], seed: number): Promise<boolean>
  selectSubtask(index: number): void
  storeActiveSubtaskAnswer(answer: UCUserAnswer[]): void
}

const subTaskInit = {
  index: 0,
  status: 'waiting',
  numberOfAttempt: 0,
  isHintsLeft: false,
  answers: [] as UCUserAnswer[],
  hints: [] as string[],
} as SubTaskState

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'checkSubTask':
      return {
        ...state,
        status: 'checking',
      }
    case 'checkFailed': {
      const currentTaskIndex = state.selectedSubtask.index
      const subTasks = dp.set(
        state.subTasks,
        [currentTaskIndex, 'numberOfAttempt'],
        state.subTasks[currentTaskIndex].numberOfAttempt + 1,
      )
      return {
        ...state,
        status: 'checkFailed',
        subTasks,
        selectedSubtask: subTasks[currentTaskIndex],
      }
    }
    case 'initNextSubtask': {
      const currentTaskIndex = state.numberOfFinishedTasks
      const nextTaskIndex = currentTaskIndex + 1
      const isDone = nextTaskIndex === state.numberOfTasks
      let subTasks = dp.merge(state.subTasks, [currentTaskIndex], {
        status: 'done',
        answers: action.previousAnswers,
      })

      subTasks = dp.merge(subTasks, [nextTaskIndex], { status: 'current' })
      return {
        ...state,
        status: isDone ? 'solved' : 'pending',
        numberOfFinishedTasks: nextTaskIndex,
        subTasks,
        selectedSubtask: subTasks[currentTaskIndex],
        isCurrentSubtaskActive: false,
      }
    }

    case 'nextHint': {
      const currentTaskIndex = state.selectedSubtask.index
      const subTasks = dp.merge(state.subTasks, [currentTaskIndex], {
        hints: state.subTasks[currentTaskIndex].hints.concat(action.hint),
        isHintsLeft: action.hasMoreHints,
      })
      return {
        ...state,
        subTasks,
        selectedSubtask: subTasks[currentTaskIndex],
      }
    }

    case 'selectSubtask': {
      const activeSubTask = state.subTasks[action.index]
      return {
        ...state,
        selectedSubtask: activeSubTask,
        isCurrentSubtaskActive: activeSubTask.index === state.numberOfFinishedTasks,
      }
    }
    default:
      return state
  }
}

///

interface Props {
  children: ReactNode
  exercise: PublicExercise
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ExerciseContext = React.createContext<State>({} as any)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ExerciseDispatchContext = React.createContext<API>({} as any)

function initState(exercise: PublicExercise): State {
  const subTasks = exercise.subTasks.map((subtask, index) => ({
    ...subtask,
    ...subTaskInit,
    index,
    status: 'waiting' as SubtaskStatus,
    isHintsLeft: subtask.hasHints,
  }))
  return {
    status: 'pending',
    exercise,
    selectedSubtask: subTasks[0],
    numberOfFinishedTasks: 0,
    isSingle: exercise.subTasks.length === 1,
    numberOfTasks: exercise.subTasks.length,
    subTasks,
    isCurrentSubtaskActive: true,
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
          result = await checkSubTask(state.exercise.id, seed, state.selectedSubtask.index, data)
        }
      } catch (e) {
        result = false
      } finally {
        if (result) {
          dispatch({ type: 'initNextSubtask', previousAnswers: data })
        } else {
          dispatch({ type: 'checkFailed' })
        }
      }
      return result
    },
    async getNextHint() {
      const { hint, hasMore } = await getNextHint(
        state.exercise.id,
        state.selectedSubtask.index,
        state.selectedSubtask.hints[state.selectedSubtask.hints.length - 1] ?? '',
      )
      dispatch({ type: 'nextHint', hint: hint, hasMoreHints: hasMore })
    },
    selectSubtask(index: number): void {
      dispatch({ type: 'selectSubtask', index })
    },
    storeActiveSubtaskAnswer(answer: UCUserAnswer[]): void {
      dispatch({ type: 'storeActiveSubtaskAnswer', answer })
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
