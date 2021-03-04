import React, { ReactNode, useReducer, Reducer } from 'react'
import { ExerciseModel, UCUserAnswer } from 'shared/exercise/types'
import { ExerciseSolution } from '../components/ExerciseBody'
import { checkSubTask } from '../services/exercise'

type Status = 'pending' | 'checking' | 'checkFailed'

interface ActiveSubTask {
  index: number
  numberOfAttempt: number
  usedHints: number
  hintsLeft: number
  isHintsLeft: boolean
}

interface State {
  status: Status
  exercise: ExerciseModel
  activeSubTask: ActiveSubTask
  isSingle: boolean
  numberOfTasks: number
  finishedTasks: number
}

type Action =
  | { type: 'checkSubTask' }
  | { type: 'checkFailed' }
  | { type: 'checkSuccess' }
  | { type: 'nextHelp' }

interface API {
  getNextHint(): void
  checkActiveSubTask(data: UCUserAnswer[], seed: number): Promise<void>
}

const activeSubTaskInit: ActiveSubTask = {
  index: 0,
  numberOfAttempt: 0,
  usedHints: 0,
  hintsLeft: 0,
  isHintsLeft: false,
}

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
    case 'checkSuccess':
      return {
        ...state,
        status: 'checkFailed',
        activeSubTask: { ...activeSubTaskInit },
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
    activeSubTask: { ...activeSubTaskInit },
    finishedTasks: 0,
    isSingle: false,
    numberOfTasks: exercise.subTasks.length,
  }
}

export function ExerciseProvider({ children, exercise }: Props): JSX.Element {
  const [state, dispetch] = useReducer<Reducer<State, Action>>(reducer, initState(exercise))

  const api: API = {
    async checkActiveSubTask(data: UCUserAnswer[], seed: number) {
      console.log(data)
      dispetch({ type: 'checkSubTask' })
      let result = false
      try {
        if (state.exercise.id) {
          result = await checkSubTask(state.exercise.id, seed, 0, data)
        }
      } finally {
        dispetch({ type: result ? 'checkSuccess' : 'checkFailed' })
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
