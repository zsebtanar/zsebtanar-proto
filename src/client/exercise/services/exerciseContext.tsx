import React, { ReactNode, useReducer, Reducer, FormEvent } from 'react'
import { ExerciseModel } from '../../../shared/exercise/types'

interface ActiveSubTask {
  numberOfAttempt: number
  usedHints: 0
}
interface State {
  exercise: ExerciseModel
  activeSubTask: ActiveSubTask
  isSingle: boolean
  numberOfTasks: number
  finishedTasks: number
}
type Action = { type: 'nextSubTask' } | { type: 'validationFailed' } | { type: 'nextHelp' }

interface ExerciseContextAPI {
  checkActiveSubTask(event: FormEvent<HTMLFormElement>): void
}

const activeSubTaskInit: ActiveSubTask = {
  numberOfAttempt: 0,
  usedHints: 0
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'nextSubTask':
      return state
    case 'validationFailed':
      return state
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
const ExerciseDispatchContext = React.createContext<ExerciseContextAPI>({} as any)

function initState(exercise: ExerciseModel): State {
  return {
    exercise,
    activeSubTask: { ...activeSubTaskInit },
    finishedTasks: 0,
    isSingle: false,
    numberOfTasks: exercise.subTasks.length
  }
}

export function ExerciseProvider({ children, exercise }: Props) {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initState(exercise))

  const api: ExerciseContextAPI = {
    checkActiveSubTask() {
      throw 'not implemented yet'
    }
  }

  return (
    <ExerciseContext.Provider value={state}>
      <ExerciseDispatchContext.Provider value={api}>{children}</ExerciseDispatchContext.Provider>
    </ExerciseContext.Provider>
  )
}

export function useExercise() {
  const context = React.useContext(ExerciseContext)
  if (context === undefined) {
    throw new Error('useExercise must be used within a ExerciseContext')
  }
  return context
}

export function useExerciseDispatch() {
  const context = React.useContext(ExerciseDispatchContext)
  if (context === undefined) {
    throw new Error('useExerciseDispatch must be used within a ExerciseDispatchContext')
  }
  return context
}
