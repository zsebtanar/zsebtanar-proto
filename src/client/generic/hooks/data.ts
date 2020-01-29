import { useReducer, Reducer, useEffect, DependencyList } from 'react'
import { wikiPageService } from 'client/wiki/services/wikiPageService'

interface State<T> {
  loading: boolean
  isEmpty?: boolean
  error?: Error
  result?: T
}

type Action<T> =
  | { type: 'loading' }
  | { type: 'success'; payload: T }
  | { type: 'error'; payload: Error }

interface API<T> extends State<T> {}

///

const initState = {
  loading: true,
  error: undefined,
  result: undefined,
  isEmpty: undefined
}

export function useDataLoad<T>(fn: () => Promise<T>, deps?: DependencyList): API<T> {
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(userReducer, initState)

  useEffect(() => {
    dispatch({ type: 'loading' })
    wikiPageService.getList().then(
      result => dispatch({ type: 'success', payload: result }),
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
      const result = action.payload
      return {
        loading: false,
        error: undefined,
        result,
        isEmpty: result === undefined || result?.['length'] === 0
      }
    }
  }
}
