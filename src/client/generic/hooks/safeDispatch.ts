import React, { Dispatch, ReducerAction, Reducer } from 'react'

export function useSafeDispatch<R extends Reducer<unknown, unknown>>(
  dispatch
): Dispatch<ReducerAction<R>> {
  const mounted = React.useRef(false)

  React.useLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return React.useCallback((...args) => (mounted.current ? dispatch(...args) : void 0), [dispatch])
}
