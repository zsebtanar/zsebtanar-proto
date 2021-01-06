import { useState, useEffect } from 'react'
import { API as ModelAPI, useModel } from './model'

type States = 'pending' | 'fetching' | 'saving' | 'idle'

interface Getters {
  readonly isPending: boolean
  readonly isFetching: boolean
  readonly isSaving: boolean
  readonly hasError: boolean
  readonly isIdle: boolean
}

export interface LoadAndStoreModelAPI<TModel> extends ModelAPI<TModel>, Getters {
  state: States
  error?: any
  save(clone?: boolean): Promise<TModel>
  reload(): void
}

///

export function useLoadAndStoreModel<TModel>(
  loadFn: (id: string) => Promise<TModel>,
  saveFn: (model: TModel) => Promise<TModel>,
  id?: string,
  initialValue?: TModel,
): LoadAndStoreModelAPI<TModel> {
  const model = useModel<TModel>()
  const [state, setState] = useState<States>('pending')
  const [error, setError] = useState<Error | undefined>(undefined)
  const [reload, setReload] = useState<number>(0)

  const fetch = async () => {
    if (id) {
      setState('fetching')
      try {
        const data = await loadFn(id)
        model.set(data)
        setState('idle')
      } catch (err) {
        setError(err)
        setState('idle')
      }
    } else {
      model.set(({ ...initialValue } ?? {}) as TModel)
      setState('idle')
    }
  }

  useEffect(() => {
    fetch()
  }, [loadFn, id, reload])

  return {
    ...model,
    state,
    error,
    async save(clone?: boolean): Promise<TModel> {
      let res = model.data
      if (state === 'idle') {
        setState('saving')
        setError(undefined)
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = model.data as any
          if (clone && data.id) {
            data.id = undefined
          }
          res = await saveFn(data)
          setState('idle')
        } catch (err) {
          setError(err)
          setState('idle')
        }
      }
      return res
    },
    reload() {
      setReload((curr) => ++curr)
    },
    get isPending() {
      return state === 'pending'
    },
    get isFetching() {
      return state === 'fetching'
    },
    get isSaving() {
      return state === 'saving'
    },
    get hasError() {
      return !!error
    },
    get isIdle() {
      return state === 'idle'
    },
  }
}
