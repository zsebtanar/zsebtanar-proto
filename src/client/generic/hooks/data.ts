import { useReducer, Reducer, useEffect, DependencyList } from 'react'

interface State<T> {
  loading: boolean
  isEmpty?: boolean
  error?: Error
  result?: T
}

type Action<T> =
  | { type: 'loading' }
  | { type: 'success'; payload: { result: T; isEmpty: boolean } }
  | { type: 'error'; payload: Error }

interface API<T> extends State<T> {}

interface Options<T> {
  isEmpty(data: T): boolean
}

///

const initState = {
  loading: true,
  error: undefined,
  result: undefined,
  isEmpty: undefined
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
          payload: {
            result,
            isEmpty: options?.isEmpty?.(result) ?? isEmpty(result)
          }
        }),
      error => dispatch({ type: 'error', payload: error })
    )
  }, deps)

  return state
}

///

function userReducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'loading':
      return { loading: true, error: undefined, result: undefined, isEmpty: undefined }
    case 'error':
      return { loading: false, error: action.payload, result: undefined, isEmpty: true }
    case 'success': {
      const { result, isEmpty } = action.payload
      return { loading: false, error: undefined, result, isEmpty }
    }
  }
}

///

function isEmpty<T>(data: T) {
  return data === undefined || data?.['length'] === 0
}
