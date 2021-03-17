import { useState, useCallback, SetStateAction, Dispatch } from 'react'
import * as dp from 'dot-prop-immutable'

type Path = number | string | (string | number)[]

export type OnChange<TValue = unknown> = (event: { name: string; value: TValue }) => void

interface BindAPI<TValue> {
  onChange: OnChange<TValue>
  name: string
  value: TValue
}

export type UseModelProps<TValue> = BindAPI<TValue>

export type API<TModel> = {
  data: TModel
  set: Dispatch<SetStateAction<TModel>>
  reset: () => void
  append<TValue>(path: Path, value: TValue): void
  remove<TValue>(path: Path): void
  bind<TValue>(name: string, defaultValue?: unknown): BindAPI<TValue>
  bindPartialModel<TValue>(defaultValue?: unknown): BindAPI<TValue>
}

interface Options<TModel> {
  name?: string
  value?: TModel
  onChange?: OnChange<TModel>
}

///

const PARTIAL_MODEL_NAME = '__partial_model_merge__'
const noop = () => undefined

export function useModel<TModel>({
  value: initialData,
  name: modelName,
  onChange,
}: Options<TModel> = {}): API<TModel> {
  const onChangeCallback = useCallback<OnChange<TModel>>(onChange ?? noop, [onChange])
  const [data, setState] = useState<TModel>(initialData ?? ({} as TModel))

  const set = (newState: TModel | ((model: TModel) => TModel)) => {
    setState((model) => {
      // eslint-disable-next-line @typescript-eslint/ban-types
      const newModel = typeof newState === 'function' ? (newState as Function)(model) : newState
      // update parent after local state saved
      new Promise(() => onChangeCallback({ name: modelName ?? '<root>', value: newModel }))
      return newModel
    })
  }

  const reset = () => setState(initialData ?? ({} as TModel))

  return {
    data,
    set,
    reset,
    append<TValue>(path: Path, value: TValue) {
      set((model) => dp.set(model, path, [...dp.get(model, path, []), value]))
    },
    remove<TValue>(path: Path) {
      set((model) => dp.delete(model, path) as never)
    },
    bind<TValue>(name: string, defaultValue?: unknown): BindAPI<TValue> {
      return {
        name,
        onChange: ({ name, value }) => set((model) => dp.set(model, name, value ?? defaultValue)),
        value: dp.get(data, name),
      }
    },
    bindPartialModel<TValue>(
      fields: string[],
      defaultValue?: Record<string, unknown>,
    ): BindAPI<TValue> {
      return {
        name: PARTIAL_MODEL_NAME,
        onChange: ({ value }) =>
          set((model) => {
            if (fields.length) {
              return fields.reduce(
                (model, name) => dp.set(model, name, value?.[name] ?? defaultValue?.[name]),
                model,
              )
            } else {
              return Object.assign({}, model, value ?? defaultValue)
            }
          }),
        value: data as never,
      }
    },
  }
}
