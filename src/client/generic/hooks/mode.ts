import { useReducer, Reducer } from 'react'
import * as dp from 'dot-prop-immutable'

type States = 'pending' | 'fetching' | 'saving' | 'idle' | 'error'

interface State<T> {
  state: States
  error?: Error
  model: T
}

type Path = number | string | (string | number)[]

interface Getters {
  readonly isPending: boolean
  readonly isFetching: boolean
  readonly isSaving: boolean
  readonly hasError: boolean
  readonly isIdle: boolean
}

interface API<T> extends State<T>, Getters {
  create(): void
  load(id: string): Promise<void>
  store(): Promise<void>
  set(path: Path, value: unknown): void
  append(path: Path, value: unknown): void
}

type Action<T> =
  | { type: 'create' }
  | { type: 'load' }
  | { type: 'loaded'; payload: T }
  | { type: 'save' }
  | { type: 'saved' }
  | { type: 'error'; payload: Error }
  | { type: 'set'; payload: { path: Path; value: unknown } }
  | { type: 'append'; payload: { path: Path; value: unknown } }

///

const initState: State<never> = {
  state: 'pending',
  model: {} as never
}

export function useModel<T>(
  loadFn: (id: string) => Promise<T>,
  storeFn: (model: T) => Promise<unknown>
): API<T> {
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(modelReducer, initState)

  return {
    ...state,
    error: undefined,
    async load(id: string): Promise<void> {
      dispatch({ type: 'load' })
      try {
        const data = await loadFn(id)
        dispatch({ type: 'loaded', payload: data })
      } catch (err) {
        dispatch({ type: 'error', payload: err })
      }
    },
    async store(): Promise<void> {
      dispatch({ type: 'save' })
      try {
        await storeFn(state.model)
        dispatch({ type: 'saved' })
      } catch (err) {
        dispatch({ type: 'error', payload: err })
      }
    },
    create() {
      dispatch({ type: 'create' })
    },
    set(path: Path, value: unknown) {
      dispatch({ type: 'set', payload: { path, value } })
    },
    append(path: Path, value: unknown) {
      dispatch({ type: 'append', payload: { path, value } })
    },
    get isPending() {
      return state.state === 'pending'
    },
    get isFetching() {
      return state.state === 'fetching'
    },
    get isSaving() {
      return state.state === 'saving'
    },
    get hasError() {
      return state.state === 'error'
    },
    get isIdle() {
      return state.state === 'idle'
    }
  }
}

///

function modelReducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'create':
      return { state: 'idle', model: {} as T }
    case 'load':
      return { ...state, state: 'fetching' }
    case 'loaded':
      return { state: 'idle', model: action.payload }
    case 'save':
      return { ...state, state: 'saving' }
    case 'saved':
      return { ...state, state: 'idle' }
    case 'error':
      return { ...state, state: 'error', error: action.payload }
    case 'set': {
      const { path, value } = action.payload
      return { ...state, state: 'error', model: dp.set(state.model, path, value) }
    }
    case 'append': {
      const { path, value } = action.payload
      return {
        ...state,
        state: 'error',
        model: dp.set(state.model, path, [...dp.get(state.model, path, []), value])
      }
    }
  }
}
