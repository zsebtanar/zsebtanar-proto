import { useReducer, Reducer, useEffect, useMemo } from 'react'
import { BaseModel } from 'shared/generic/types'
import { Service } from '../services/fireStoreBase'

type States = 'pending' | 'loading' | 'success' | 'noResult' | 'error'

const DEFAULT_PAGE_SIZE = 25

interface State<T> {
  state: States
  error?: Error
  list?: T[]
  lastQuerySnapshot?: firebase.firestore.QuerySnapshot
  lastResultLength: number
  page: number
}

interface Getters {
  readonly isPending: boolean
  readonly isLoading: boolean
  readonly hasError: boolean
  readonly isSuccess: boolean
  readonly hasNoResult: boolean
  readonly hasMore: boolean
  next(): void
  prev(): void
}

export interface FetchFirestoreListAPI<T> extends State<T>, Getters {}

type Action<T> =
  | { type: 'loading' }
  | {
      type: 'success'
      payload: { result: firebase.firestore.QuerySnapshot; accumulate: boolean }
    }
  | { type: 'error'; payload: Error }
  | { type: 'nextPage'; payload: { pageSize: number } }
  | { type: 'prevPage' }

export interface FetchFirestoreListOptions {
  filter?: GridFilterOptions
  pageSize: number
  accumulate: boolean
}

///

const initState: State<never> = {
  state: 'pending',
  lastResultLength: Infinity,
  page: 0,
}

export function useFetchFirestoreList<T extends BaseModel>(
  collection: string,
  options?: FetchFirestoreListOptions,
): FetchFirestoreListAPI<T> {
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(userReducer, initState)
  const service = useMemo(() => new Service<T>(collection), [collection])

  useEffect(() => {
    dispatch({ type: 'loading' })
    service
      .getRawList({
        ...options?.filter,
        limit: options?.pageSize || DEFAULT_PAGE_SIZE,
        startAfter: state.lastQuerySnapshot,
      })
      .then((result) =>
        dispatch({
          type: 'success',
          payload: { result, accumulate: options?.accumulate ?? false },
        }),
      )
      .catch((error) => dispatch({ type: 'error', payload: error }))
  }, [JSON.stringify(options), state.page])

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
    get hasMore() {
      return !(state.lastResultLength < (options?.pageSize ?? DEFAULT_PAGE_SIZE))
    },
    next() {
      dispatch({ type: 'nextPage', payload: { pageSize: options?.pageSize || DEFAULT_PAGE_SIZE } })
    },
    prev() {
      if (!options?.accumulate) {
        dispatch({ type: 'prevPage' })
      }
    },
  }
}

///

function userReducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        state: 'loading',
        list: undefined,
        error: undefined,
      }
    case 'error':
      return { ...state, state: 'error', error: action.payload, list: undefined }
    case 'success': {
      const { result, accumulate } = action.payload
      const list = result.docs.map<T>((doc) => ({ id: doc.id, ...(doc.data() as T) }))
      const newList = accumulate ? [...(state.list ?? []), ...list] : list
      return {
        ...state,
        state: result.empty ? 'noResult' : 'success',
        error: undefined,
        list: newList,
        lastQuerySnapshot: result,
        lastResultLength: result.size,
      }
    }
    case 'nextPage':
      if (state.lastResultLength < action.payload.pageSize) {
        return state
      } else {
        return { ...state, page: state.page + 1 }
      }
    case 'prevPage':
      if (state.page === 0) {
        return state
      } else {
        return { ...state, page: state.page - 1 }
      }
  }
}
