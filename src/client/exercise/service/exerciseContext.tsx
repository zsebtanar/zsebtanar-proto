import React, { ReactNode, useReducer, Reducer } from 'react'
import { ExerciseData } from '../type'
import { pairsInOrder } from '../../../shared/util/fn'

interface ActiveSubTask {
  numberOfAttempt: number
  usedHints: 0
}
interface State {
  exercise: ExerciseData
  activeSubTask: ActiveSubTask
  isSingle: boolean
  numberOfTasks: number
  finishedTasks: number
}
type Action =
  | { type: 'init'; payload: ExerciseData }
  | { type: 'nextSubTask' }
  | { type: 'validationFailed' }
  | { type: 'nextHelp' }

interface ExerciseContextAPI {
  init(exercise: ExerciseData): void
  checkActiveSubTask(): void
}

const activeSubTaskInit: ActiveSubTask = {
  numberOfAttempt: 0,
  usedHints: 0
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'init': {
      const exercise = action.payload
      const subTasks = pairsInOrder(exercise.subTasks)
      return {
        exercise,
        activeSubTask: { ...activeSubTaskInit },
        finishedTasks: 0,
        isSingle: false,
        numberOfTasks: subTasks.length
      }
    }
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
}

const ExerciseContext = React.createContext<State>(undefined)
const ExerciseDispatchContext = React.createContext<ExerciseContextAPI>(undefined)

export function ExerciseProvider({ children }: Props) {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, undefined)

  const api: ExerciseContextAPI = {
    init(exercise: ExerciseData) {
      dispatch({ type: 'init', payload: exercise })
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
