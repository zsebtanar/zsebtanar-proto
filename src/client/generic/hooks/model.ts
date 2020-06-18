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
  append<TValue>(path: Path, value: TValue): void
  remove<TValue>(path: Path): void
  bind<TValue>(name: string): BindAPI<TValue>
  bindPartialModel<TValue>(): BindAPI<TValue>
}

interface Options<TModel> {
  name?: string
  value?: TModel
  onChange?: OnChange<TModel>
}

///

const ROOT = '__partial_model_merge__'
const noop = () => undefined

export function useModel<TModel>({
  value: initialData,
  name: modelName,
  onChange
}: Options<TModel> = {}): API<TModel> {
  const onChangeCallback = useCallback<OnChange<TModel>>(onChange ?? noop, [onChange])
  const [data, setState] = useState<TModel>(initialData ?? ({} as TModel))

  const set = (newState: TModel | ((model: TModel) => TModel)) => {
    setState(model => {
      const newModel = typeof newState === 'function' ? (newState as Function)(model) : newState
      onChangeCallback({ name: modelName ?? '<root>', value: newModel })
      return newModel
    })
  }

  return {
    data,
    set,
    append<TValue>(path: Path, value: TValue) {
      set(model => dp.set(model, path, [...dp.get(model, path, []), value]))
    },
    remove<TValue>(path: Path) {
      set(model => dp.delete(model, path) as never)
    },
    bind<TValue>(name: string): BindAPI<TValue> {
      return {
        name,
        onChange: ({ name, value }) => set(model => dp.set(model, name, value)),
        value: dp.get(data, name)
      }
    },
    bindPartialModel<TValue>(): BindAPI<TValue> {
      return {
        name: ROOT,
        onChange: ({ value }) => set(model => Object.assign({}, model, value)),
        value: data as never
      }
    }
  }
}
