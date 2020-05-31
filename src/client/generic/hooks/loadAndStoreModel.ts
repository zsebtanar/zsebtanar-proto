import { useState } from 'react'
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
  create(): void
  load(id: string): Promise<void>
  store(): Promise<void>
}

///

export function useLoadAndStoreModel<TModel>(
  loadFn: (id: string) => Promise<TModel>,
  storeFn: (model: TModel) => Promise<unknown>
): API<TModel> {
  const model = useModel<TModel>()
  const [state, setState] = useState<States>('pending')
  const [error, setError] = useState<Error | undefined>(undefined)

  return {
    ...model,
    state,
    error,
    async load(id: string): Promise<void> {
      setState('fetching')
      try {
        const data = await loadFn(id)
        model.set(data)
        setState('idle')
      } catch (err) {
        setError(err)
        setState('error')
      }
    },
    async store(): Promise<void> {
      setState('saving')

      try {
        await storeFn(model.data)
        setState('idle')
      } catch (err) {
        setError(err)
        setState('error')
      }
    },
    create() {
      model.set({} as TModel)
      setState('idle')
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
