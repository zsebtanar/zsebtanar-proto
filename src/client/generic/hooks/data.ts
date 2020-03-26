import { useReducer, Reducer, useEffect, DependencyList } from 'react'

interface State<T> {
  state: 'pending' | 'loading' | 'success' | 'noResult' | 'error'
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

interface API<T> extends State<T>, Getters{}

type Action<T> =
  | { type: 'loading' }
  | { type: 'success'; payload: { result: T; isEmpty: boolean } }
  | { type: 'error'; payload: Error }

interface Options<T> {
  isEmpty(data: T): boolean
}

///


const initState: State<never> = {
  state: 'pending'
}

const getters: Getters = {
  get isPending(this: State<never>) {return this.state === 'pending'},
  get isLoading(this: State<never>) {return this.state === 'loading'},
  get hasError(this: State<never>) {return this.state === 'error'},
  get isSuccess(this: State<never>) {return this.state === 'success'},
  get hasNoResult(this: State<never>) {return this.state === 'noResult'}
}

export function useDataLoad<T>(
  loaderFn: () => Promise<T>,
  deps?: DependencyList,
  options?: Options<T>
): API<T> {
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(userReducer, initState)

  useEffect(() => {
    dispatch({ type: 'loading' })
    loaderFn().then(
      result =>
        dispatch({
          type: 'success',
          payload: { result, isEmpty: options?.isEmpty?.(result) ?? isEmpty(result) }
        }),

    ).catch(error => dispatch({ type: 'error', payload: error }))
  }, deps)

  return { ...state, ...getters }
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
