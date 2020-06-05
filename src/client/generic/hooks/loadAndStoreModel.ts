import { useState, useEffect } from 'react'
import { API as ModelAPI, useModel } from './model'

type States = 'pending' | 'fetching' | 'saving' | 'idle' | 'error'

interface Getters {
  readonly isPending: boolean
  readonly isFetching: boolean
  readonly isSaving: boolean
  readonly hasError: boolean
  readonly isIdle: boolean
}

interface API<TModel> extends ModelAPI<TModel>, Getters {
  state: States
  error?: Error
  save(): Promise<void>
}

///

export function useLoadAndStoreModel<TModel>(
  loadFn: (id: string) => Promise<TModel>,
  saveFn: (model: TModel) => Promise<unknown>,
  id?: string
): API<TModel> {
  const model = useModel<TModel>()
  const [state, setState] = useState<States>('pending')
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    if (id) {
      setState('fetching')
      try {
        loadFn(id).then(data => {
          model.set(data)
          setState('idle')
        })
      } catch (err) {
        setError(err)
        setState('error')
      }
    } else {
      model.set({} as TModel)
      setState('idle')
    }
  }, [loadFn, id])

  return {
    ...model,
    state,
    error,
    async save(): Promise<void> {
      if (state === 'idle') {
        setState('saving')

        try {
          await saveFn(model.data)
          setState('idle')
        } catch (err) {
          setError(err)
          setState('error')
        }
      }
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
      return state === 'error'
    },
    get isIdle() {
      return state === 'idle'
    }
  }
}
