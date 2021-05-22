import { useReducer, Reducer, useEffect, DependencyList } from 'react'

type States = 'pending' | 'loading' | 'success' | 'noResult' | 'error'

interface State<T> {
  state: States
  error?: Error
  result?: T
}

interface Getters {
  readonly isPending: boolean
  readonly isLoading: boolean
  readonly hasError: boolean
  readonly isSuccess: boolean
  readonly hasNoResult: boolean
}

export interface FetchDataAPI<T> extends State<T>, Getters {}

type Action<T> =
  | { type: 'loading' }
  | { type: 'success'; payload: { result: T; isEmpty: boolean } }
  | { type: 'error'; payload: Error }

interface Options<T> {
  isEmpty(data: T): boolean
}

///

const initState: State<never> = {
  state: 'pending',
}

export function useFetchData<T>(
  loaderFn: () => Promise<T>,
  deps: DependencyList = [],
  options?: Options<T>,
): FetchDataAPI<T> {
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(userReducer, initState)

  useEffect(() => {
    dispatch({ type: 'loading' })
    loaderFn()
      .then((result) =>
        dispatch({
          type: 'success',
          payload: { result, isEmpty: options?.isEmpty?.(result) ?? isEmpty(result) },
        }),
      )
      .catch((error) => dispatch({ type: 'error', payload: error }))
  }, [options?.isEmpty, ...deps])

  return {
    ...state,
    get isPending() {
      return state.state === 'pending'
    },
    get isLoading() {
      return state.state === 'loading'
    },
    get hasError() {
      return state.state === 'error'
    },
    get isSuccess() {
      return state.state === 'success'
    },
    get hasNoResult() {
      return state.state === 'noResult'
    },
  }
}

///

function userReducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'loading':
      return { state: 'loading', result: undefined, error: undefined }
    case 'error':
      return { state: 'error', error: action.payload, result: undefined }
    case 'success': {
      const { result, isEmpty } = action.payload
      return { state: isEmpty ? 'noResult' : 'success', error: undefined, result }
    }
  }
}

///

function isEmpty<T>(data: T) {
  return data === undefined || data?.['length'] === 0
}
