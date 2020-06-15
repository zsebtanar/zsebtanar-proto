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
  save(clone?: boolean): Promise<TModel>
}

///

export function useLoadAndStoreModel<TModel>(
  loadFn: (id: string) => Promise<TModel>,
  saveFn: (model: TModel) => Promise<TModel>,
  id?: string,
  initialValue?: TModel
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
      model.set(({ ...initialValue } ?? {}) as TModel)
      setState('idle')
    }
  }, [loadFn, id])

  return {
    ...model,
    state,
    error,
    async save(clone?: boolean): Promise<TModel> {
      let res = model.data
      if (state === 'idle') {
        setState('saving')

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
          setState('error')
        }
      }
      return res
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
