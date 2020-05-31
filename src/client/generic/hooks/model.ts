import { useState, useCallback, SetStateAction, Dispatch } from 'react'
import * as dp from 'dot-prop-immutable'

type Path = number | string | (string | number)[]

export type OnChange<TValue = unknown> = (name: string, value: TValue) => void

type BindReturn<TValue> = {
  onChange: OnChange<TValue>
  name: string
  value: TValue
}

export type API<TModel> = {
  data: TModel
  set: Dispatch<SetStateAction<TModel>>
  append<TValue>(path: Path, value: TValue)
  remove<TValue>(path: Path)
  bind<TValue>(name: string): BindReturn<TValue>
}

///

export const ROOT = '__root__'

export function useModel<TModel>(
  initialData: TModel = {} as TModel,
  modelName = '<root>',
  onChange: OnChange<TModel> = () => undefined
): API<TModel> {
  const onChangeCallback = useCallback<OnChange<TModel>>(onChange, [onChange])
  const [data, setState] = useState<TModel>(initialData)

  const set = (s: TModel | ((model: TModel) => TModel)) => {
    setState(model => {
      const newModel = typeof s === 'function' ? s(model) : s
      onChangeCallback(modelName, newModel)
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
    bind<TValue>(name: string): BindReturn<TValue> {
      return {
        name,
        onChange: (name, value) =>
          set(model =>
            name === ROOT ? Object.assign({}, model, value) : dp.set(model, name, value)
          ),
        value: name === ROOT ? (data as never) : dp.get(data, name)
      }
    }
  }
}
